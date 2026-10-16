# AI-Enabled Clinical Gait Analysis: Deep Learning for Biomechanics from Monocular Video

> **Research Capstone Project**  
> *Vellore Institute of Technology, Chennai*  
> *Co-authored with Debeshi Sen (23BDS1055) · Supervised by Dr. Pavithra L K*  
> *Benchmark: 70.7% Balanced Accuracy across 4 Neurological Gait Conditions*

---

## 1. The Clinical Problem: Beyond the Multi-Camera MoCap Lab

Walking looks effortless, but it requires millisecond-level orchestration between the central nervous system, musculoskeletal kinematics, and spinal reflexes. When a neurological insult occurs—such as ischemic stroke, cerebral palsy, or progressive muscular dystrophy—the gait signature changes immediately. 

Clinicians rely on gait assessment to titrate medications, schedule surgeries, and monitor rehabilitation. However, gold-standard clinical gait analysis today requires:

- Multi-camera infrared motion-capture rigs ($100k+),
- Reflective skin markers attached precisely to anatomical landmarks,
- Synchronized piezoelectric force plates, and
- Dedicated biomechanics engineers.

For millions of patients in small towns and community clinics, accessing a motion-capture lab is physically and financially impossible. 

Our goal was clear: **Can we achieve rigorous, clinically meaningful neurological gait classification using an ordinary monocular video from a smartphone or single webcam—without any wearable sensors or markers?**

![AI-Enabled Monocular Gait Biomechanics Pipeline Architecture](/gait-thumbnail.png)

---

## 2. End-to-End Processing Architecture

The architecture addresses the messiness of real-world smartphone video: varying camera heights, unknown lens focal lengths, changing frame rates (10 to 60 FPS), and moving clinical personnel.

![GAVD Pipeline Stage Breakdown and Landmark Trajectories](/gait-pipeline.jpg)

### Step 1: Video Ingestion & Container Normalization

Raw videos arrive in diverse codecs (AV1, H.264, VP9) and variable frame rates. We ingest and normalize every candidate stream via **FFmpeg**:

- Transcoding to standardized H.264 video streams at original capture timestamps.
- Preserving true frame presentation timestamps to prevent temporal distortion.

### Step 2: Subject Isolation (YOLOv8 + ByteTrack)

In clinical settings, therapists or family members often walk beside the patient. To track the patient reliably:

- We run the **YOLOv8n** detector per frame to generate bounding boxes for all detected humans.
- **ByteTrack** links detections across frames using Kalman filtering and bipartite IoU matching, assigning consistent `track_id` sequences.
- The dominant trajectory across temporal frames is automatically isolated as the patient, writing bounding coordinates to `tracking.npz`.

### Step 3: 147-Dimensional Pelvic-Scaled Pose Kinematics

We extract 33 anatomical landmarks using **MediaPipe Pose** and retain the 12 core gait articulation joints: bilateral shoulders, hips, knees, ankles, heels, and toes.

To eliminate camera distance and patient body size artifacts, all joint coordinates are transformed into pelvic-centered, torso-scaled space:

$$\hat{x}_j(t) = \frac{x_j(t) - p(t)}{s}$$

Where $x_j(t)$ is the coordinate of joint $j$ at frame $t$, $p(t)$ is the mid-hip pelvic origin, and $s$ is the median torso scale (distance from shoulder midpoint to hip midpoint).

From these normalized coordinates, we compute:

1. **36 Cartesian coordinates** $(x, y, z)$ of the 12 key joints.
2. **36 first-order velocities** and **36 second-order accelerations** scaled by capture FPS.
3. **6 bilateral anatomical joint angles** (hip flexion, knee flexion, ankle dorsiflexion) derived via vector dot products:

$$\theta_b = \arccos\left( \frac{(a - b) \cdot (c - b)}{\|a - b\| \, \|c - b\|} \right)$$

4. **18 bilateral signed coordinate differences** and **6 bilateral angle symmetry differentials**, creating a rich **147-dimensional kinematic feature vector** at each time step.

### Step 4: 28-Dimensional RAFT Dense Optical Flow

Skeleton coordinates often fail under severe occlusion (e.g., loose clothes, walking aids, frontal views where the swing leg is hidden behind the stance leg). To solve this, we compute dense pixel velocity fields $(u, v)$ between consecutive frames using **RAFT (Recurrent All-Pairs Field Transforms)**.

We divide the patient bounding box into four anatomical zones:

- **Full frame** (global progression),
- **Upper body** (trunk tilt & lateral sway),
- **Left lower body** (left stride swing & heel contact),
- **Right lower body** (right stride swing & heel contact).

For each region $R$, we extract seven motion statistics:

$$d_R = \left[ \text{mean}(|F|), \text{std}(|F|), P_{90}(|F|), \text{mean}(u), \text{mean}(v), \text{mean}(\sin\theta), \text{mean}(\cos\theta) \right]$$

Aggregating four regions yields a compact **28-dimensional flow descriptor** per frame pair.

---

## 3. Mathematical Foundations: Cadence, Velocity & SPARC Smoothness

To compare patients who walk at different cadences or distances from the lens, we formulate two primary biomechanical metrics:

### 1. Temporal Gait Cadence & Cycle Duration from FPS

A human stride cycle spans initial contact (heel-strike) of one foot to the next initial contact of the same foot. We compute the autocorrelation of the vertical ankle height difference $\Delta y_{\text{ankle}}(t) = y_{\text{left}}(t) - y_{\text{right}}(t)$. The dominant peak between 0.5s and 2.5s gives the stride period $N_{\text{frames}}$:

$$T_c = \frac{N_{\text{frames}}}{\text{FPS}}$$

Every walk is then linearly interpolated into **$T = 100$ normalized time points** (representing 0% to 100% of the gait cycle), matching international biomechanics standards.

### 2. Relative Walking Speed

Because monocular cameras lack real-world metric calibration, we compute the pelvic-centered relative velocity profile across the 100 normalized cycle steps:

$$V = \frac{1}{T_c} \sum_{k=1}^{100} \| c(k) - c(k-1) \|$$

Where $c(k)$ is the scaled 2D body centroid position at cycle step $k$. In our experiments, this normalized speed reliably separated Healthy controls (median 3.89 units/s) from Hemiparetic Stroke survivors (median 2.61 units/s, $p = 0.002$).

### 3. Movement Smoothness via SPARC

Movement smoothness reflects motor control maturity and neurological recovery. Traditional jerk metrics (derivative of acceleration) are hypersensitive to video tracking noise. Instead, we implement the **Spectral Arc Length (SPARC)** metric:

$$\text{SPARC} \triangleq -\int_0^{\omega_c} \sqrt{\left(\frac{1}{\omega_c}\right)^2 + \left(\frac{d\hat{V}(\omega)}{d\omega}\right)^2} \, d\omega$$

Where:

- $\hat{V}(\omega) = \frac{V(\omega)}{V(0)}$ is the normalized Fourier velocity spectrum, and
- $\omega_c$ is the adaptive high-frequency cutoff (capturing 99% of spectral energy up to 10 Hz).

Values closer to zero signify smooth, harmonious motor control, whereas negative deviations indicate intermittent, jerky compensations typical in spastic diplegia and stroke.

---

## 4. Dilated Temporal Convolutional Networks (TCN)

Rather than heavy LSTMs that struggle with temporal drift or massive vision transformers that overfit on small clinical cohorts, we implemented a dual-stream **Dilated Temporal Convolutional Network (TCN)**.

Each residual block employs dilated 1D temporal convolutions:

$$\text{Receptive Field} = 1 + \sum_{l=0}^{L-1} 2 (k - 1) \cdot 2^l$$

With kernel size $k = 3$ and dilations $d \in \{1, 2, 4, 8\}$, each output feature step sees a receptive temporal window of 61 time steps (>60% of the stride). A global average pool compresses the sequence into a 64-dimensional embedding per stream before classification through a class-weighted cross-entropy head.

---

## 5. Avoiding Data Leakage: Video-Grouped Cross-Validation

Many published video gait studies boast unrealistic >98% accuracies because clips from the same source video were randomly split into training and test folds. The neural net simply memorizes the wallpaper, clothes, or room lighting.

To enforce clinical validity:

- We implemented **strict 5-fold video-grouped cross-validation (`StratifiedGroupKFold`)** across 382 sequences from 75 patients.
- **Zero source videos** were ever shared between training, validation, and test splits.
- Feature scaling parameters and class imbalance weights were fitted strictly on the inner training folds only.

### Key Benchmark Results:

| Model Variant | Balanced Accuracy | Macro F1 | Weighted F1 |
| :--- | :---: | :---: | :---: |
| **RAFT-TCN-Raw (Optical Flow Only)** | **70.65%** | **0.6886** | **0.7032** |
| Pose147+RobustRAFT-TCN (Fusion) | 66.44% | 0.6545 | 0.6973 |
| Pose-TCN-147 (Pose Only) | 53.21% | 0.5209 | 0.5468 |

### Why Optical Flow Beat Pose Estimation

The optical flow model dramatically outperformed skeleton pose alone (70.7% vs 53.2%). Under monocular video, MediaPipe often swaps or jitters joints during self-occlusion or non-perpendicular camera angles. Dense optical flow, by contrast, pools motion energy over entire anatomical regions, preserving trunk sway, step cadence, and limb velocity profiles without requiring perfect individual joint detections.

---

## 6. What's Next

This work forms the foundation of our ongoing hospital clinical pilot. By combining single-camera video tracking with explainable velocity profiles, SPARC smoothness curves, and class confidence intervals, we hope to put reliable, non-invasive gait assessment into the pocket of every physical therapist and rural clinic.
