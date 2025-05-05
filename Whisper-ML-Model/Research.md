# Improving the Whisper Speech to Text Output

## Research 

1. https://arxiv.org/html/2402.18923v1

2. https://arxiv.org/abs/2202.05396

3. https://www.isca-archive.org/interspeech_2023/kouzelis23_interspeech.pdf

## Datasets  

1. [FluencyBank Timestamped](https://pubs.asha.org/doi/10.1044/2024_JSLHR-24-00070)

2. [Boli](https://arxiv.org/html/2501.15877v1)

3. [SEP-28k](https://arxiv.org/abs/2102.12394)

## Implementation Strategies 

1. Adapt Whisper for Disfluency Detection
Rather than trying to make Whisper transcribe disfluencies (which goes against its design), consider using it as a base model and adding a disfluency detection layer. Research has shown that "extending the ASR model with an inappropriate pause prediction layer for end-to-end inappropriate pause detection" can be effective for capturing speech patterns like pauses.

2. Implement a Multi-Feature Approach

3. Fine-Tune Models with Disfluent Speech Data

4. Cascaded Approach