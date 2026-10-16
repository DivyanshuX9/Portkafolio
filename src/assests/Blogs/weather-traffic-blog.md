# Traffic Sign Recognition for Autonomous Driving: Weather Robustness & Cross-Country Generalization

> **Research Report**  
> *Divyanshu Sharma · Vellore Institute of Technology*  
> *Domain: Computer Vision, Weather Robustness & Domain Adaptation*

---

## 1. The Challenge: Beyond Sunny Day Perception

Self-driving cars depend fundamentally on being able to read the road. Speed limits, stop signs, yield signs, and warning signs all carry critical information the vehicle needs to act upon in fractions of a second. A recognition system that only works on sunny days or only on signs from one specific municipality is not ready for real deployment.

Most computer vision benchmarks evaluate traffic sign recognition on clean, well-lit images from a single country. This project set out to build a model that is not only accurate on clean data, but resilient to adverse weather conditions—including rain, fog, motion blur, and sensor noise—and capable of transferring its knowledge across international borders with minimal extra training.

---

## 2. The Datasets & The "Non-Mergeable" Problem

This research evaluates two distinct European driving datasets:
1. **GTSRB (German Traffic Sign Recognition Benchmark)**: 43 sign classes photographed under real driving conditions in Germany (39,209 training images, 12,630 official test images).
2. **BTSD (Belgian Traffic Sign Classification)**: 62 classes from Belgian roadways (4,575 training images—roughly ~74 images per class; 2,520 test images).

Crucially, **these two datasets cannot simply be merged**. Both use sequential integer class IDs starting from 0, but their semantic ground truth is completely divergent:
- GTSRB Class 0 = $20 \text{ km/h}$ Speed Limit
- BTSD Class 0 = Bumpy Road Warning

Merging them directly would corrupt the representation space. Instead, we train on GTSRB and formulate a disciplined domain transfer evaluation.

---

## 3. Architecture & The "58% Preprocessing Bug"

We selected **EfficientNetB3** (~12M parameters) pre-trained on ImageNet, coupled with a custom classification head (GlobalAveragePooling2D → BatchNorm → Dropout 0.4 → Dense 512 ReLU → Dropout 0.5 → Softmax).

### The Root Cause of Stalled Learning
An initial baseline with MobileNetV2 stalled at ~58% accuracy. Investigating the gradient flow revealed a critical culprit: **preprocessing scale mismatch**. 

Many developers apply a naive `pixel / 255.0` normalization. However, EfficientNet architectures require their model-specific `preprocess_input` transformation. Using simple division placed inputs completely outside the distribution the convolutional backbone was designed for. Once fixed to use the correct normalization pipeline, Phase 2 fine-tuning achieved:
- **98.98% validation accuracy** on the internal GTSRB split,
- **89.52% accuracy** on the official unseen GTSRB test set.

---

## 4. Experiment 2: Adversarial Weather Robustness

Real autonomous vehicles encounter lens spray, heavy downpours, night glare, and high-speed motion blur. We subjected the test set to six synthetic corruptions at severity level 3:
- **Motion Blur**: 9px horizontal kernel blur,
- **Fog**: 24% intensity white additive overlay,
- **Rain**: Albumentations `RandomRain` with diagonal streaks and drop blur,
- **Gaussian Noise**: Additive noise with $\sigma = 36$,
- **Brightness & Low Light**: Overexposure ($1.6\times$) and underexposure ($0.46\times$).

### Targeted Weather Augmentation
By fine-tuning the top 40 layers of the backbone with randomized photorealistic weather augmentations (applied to 65% of training samples), the model achieved significant robustness recovery:

| Environmental Condition | Clean Baseline Model | Weather-Trained Model | Net Gain |
| :--- | :---: | :---: | :---: |
| **Clean (Benchmark)** | 89.52% | **92.70%** | **+3.18 pp** |
| **Gaussian Noise** | 41.00% | **72.66%** | **+31.66 pp** |
| **Rain** | 16.27% | **30.53%** | **+14.26 pp** |
| **Motion Blur** | 61.16% | **67.02%** | **+5.86 pp** |
| **Fog** | 89.59% | **92.90%** | **+3.31 pp** |
| **Low Light** | 88.96% | **92.42%** | **+3.46 pp** |
| **Overall Average** | 62.33% | **74.26%** | **+11.93 pp** |

---

## 5. Experiment 3 & 4: Zero-Shot vs. Domain Adaptation

### Why Zero-Shot Transfer Failed (2.3% Top-1)
When testing the German-trained model directly on 28 visually identical Belgian sign classes without any Belgian training data, accuracy collapsed to **2.3%** (with only "Ahead Only" achieving 100%). 

This failure stems from **dataset-level domain shift**: differences in camera sensor response, lens distortions, color grading, and ambient lighting environments change the raw pixel statistics even when signs appear identical to human eyes.

### Fine-Tuning with Limited Data: The 86.2% Headline Finding
In Experiment 4, we replaced the 43-class German output layer with a 62-class Belgian head and evaluated two paradigms on BTSD's modest training split (~74 images/class):
1. **Scratch Baseline**: EfficientNetB3 initialized with random weights.
2. **Transfer Model**: EfficientNetB3 pre-trained on GTSRB + weather augmentations.

### The Contrast:
- **Trained from Scratch**: Stalled at **8.6% accuracy**. With only 74 samples per class, a 12-million-parameter network severely underfits and fails to learn generalizable visual features.
- **Transfer Learning**: Reached **94.8% Top-1 accuracy** (and **99.1% Top-3 accuracy**)!

### The Key Takeaway
When target real-world data is constrained, **transfer learning is not merely an optimization—it is the only paradigm that works at all**. Pre-trained visual representations provide the invariant edge and geometric priors that enable robust edge deployment in autonomous vehicles.

