// Auto-generated from Q&A.docx (Chapter 1, 30 questions) plus TEST questions for Chapters 2–4

export const QUESTIONS = [
{
    id: 1,
    sectionTags: [
      "1.1 Latent Space – The Model’s Map of Meaning",
      "1.2 Embeddings – Coordinates in that Space",
    ],
    difficulty: "Medium",
    prompt: "Which of the following best describes latent space in LLMs?",
    options: [
      { key: "A", text: "A dictionary of encoded tokens" },
      { key: "B", text: "A multidimensional semantic representation the model uses internally" },
      { key: "C", text: "A reserved memory area for embeddings only" },
      { key: "D", text: "A normalization layer applied before attention" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Latent space is the model’s internal, high-dimensional “map of meaning,” where semantically similar concepts are close together and dissimilar concepts are far apart. When we say the model “moves” through latent space, we are describing how it transitions between these internal representations to generate output.

Option A is incorrect because a dictionary of encoded tokens is just a mapping from words to IDs and does not capture deep semantic structure.
Option C is incorrect because latent space is not merely a reserved memory area for embeddings; it is the emergent representational space built across the network.
Option D is incorrect because normalization layers are separate components that stabilize training; they do not define the semantic geometry of the model’s knowledge.`,
    underlyingPrinciple: "Latent Space - The internal representational space in which a model encodes patterns of meaning and relationships among tokens, phrases, and concepts.",
    improvedPromptExample: `“Explain latent space in large language models as if you are teaching a group of non-technical professionals. Use at least one visual analogy (like a map or a galaxy) and give a short example of how changing a point in latent space might change the model’s output.”`,
  },
  {
    id: 2,
    sectionTags: [
      "1.1 Latent Space – The Model’s Map of Meaning",
      "1.2 Embeddings – Coordinates in that Space",
    ],
    difficulty: "Medium",
    prompt: "Which of the following best describes an embedding in the context of language models?",
    options: [
      { key: "A", text: "A one-hot vector representing a single word in a vocabulary" },
      { key: "B", text: "A compressed vector representing semantic properties of tokens or sentences" },
      { key: "C", text: "A hash of the input text used for indexing" },
      { key: "D", text: "A pointer to a location in GPU memory" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
In language models, an embedding is a dense, low-dimensional vector representation of tokens, sentences, or documents that captures semantic relationships and properties. These vectors live in latent space and enable the model to measure similarity or perform arithmetic-like operations on meaning.

Option A is incorrect because a one-hot vector is sparse and does not compress semantic information; it only encodes identity.
Option C is incorrect because a hash is typically non-invertible and does not preserve semantic geometry.
Option D is incorrect because an embedding is a conceptual representation, not a hardware pointer.`,
    underlyingPrinciple: "Embeddings - Dense vector representations that encode semantic information, making it possible to measure similarity and manipulate meaning numerically.",
    improvedPromptExample: `“Describe what embeddings are in language models using an analogy to ‘coordinates on a map of meaning.’ Give at least two examples of how embeddings can be used in search or recommendation systems, in non-technical language.”`,
  },
  {
    id: 3,
    sectionTags: [
      "1.3 Semantic Drift – When Meaning Slowly Slides Away",
    ],
    difficulty: "Medium",
    prompt: "What is semantic drift in the context of LLM-generated content?",
    options: [
      { key: "A", text: "A sudden crash in model performance due to hardware faults" },
      { key: "B", text: "The model’s output gradually shifting away from the user’s original intent" },
      { key: "C", text: "The model forgetting its training data entirely" },
      { key: "D", text: "A form of data corruption in the training dataset" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Semantic drift occurs when the model’s responses gradually wander away from the user’s initial request or topic, while still sounding fluent and coherent. It is particularly common in long or multi-step generations.

Option A is incorrect because hardware faults typically cause errors or crashes, not coherent but off-topic text.
Option C is incorrect because the model does not literally forget its training data; it uses a fixed set of parameters.
Option D is incorrect because semantic drift is about the model’s live generation behavior, not corruption of the original training data.`,
    underlyingPrinciple: "Semantic Drift - The tendency of generative models to gradually deviate from the original topic or intent across long or iterative generations.",
    improvedPromptExample: `“You are a careful assistant. As you generate a long answer, periodically restate the user’s goal in one sentence and check that your response is still aligned. If your content begins to drift off-topic, pause and realign to the original request.”`,
  },
  {
    id: 4,
    sectionTags: [
      "1.3 Semantic Drift – When Meaning Slowly Slides Away",
    ],
    difficulty: "Hard",
    prompt: "Which mitigation strategy best reduces semantic drift in a long, multi-part AI-generated report?",
    options: [
      { key: "A", text: "Allowing the model to continue generating without interruption" },
      { key: "B", text: "Splitting the task into smaller sections with explicit instructions for each part" },
      { key: "C", text: "Increasing the model’s temperature" },
      { key: "D", text: "Reducing the context window size" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Splitting a long report into smaller, well-defined sections with explicit prompts for each part helps the model stay on topic and reduces semantic drift.

Option A is incorrect because uninterrupted generation increases the risk of drifting.
Option C is incorrect because increasing temperature generally introduces more variability, often making drift worse.
Option D is incorrect because shrinking the context window usually makes it harder for the model to maintain coherence across sections, not easier.`,
    underlyingPrinciple: "Decomposition - Breaking complex tasks into smaller, more controlled steps reduces drift and improves alignment with user goals.",
    improvedPromptExample: `“Create a four-part report on [TOPIC]. For each part, I will give you a specific prompt. Before starting each section, briefly summarize what that section should achieve and confirm you are still aligned with the original goal.”`,
  },
  {
    id: 5,
    sectionTags: [
      "1.4 Attention – How the Model Focuses",
    ],
    difficulty: "Medium",
    prompt: "In transformer architectures, what is the primary role of the attention mechanism?",
    options: [
      { key: "A", text: "To permanently store long-term memories" },
      { key: "B", text: "To dynamically weight the importance of different tokens in the context" },
      { key: "C", text: "To compress the model’s parameters into fewer layers" },
      { key: "D", text: "To ensure that all tokens receive equal importance" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Attention allows the model to assign different levels of importance to different tokens in the input sequence, so it can focus more on relevant parts when predicting the next token.

Option A is incorrect because attention does not provide long-term memory; it operates within the current context window.
Option C is incorrect because attention does not compress parameters; it uses them to compute relevance scores.
Option D is incorrect because attention specifically differentiates importance rather than treating all tokens equally.`,
    underlyingPrinciple: "Attention - A mechanism that lets the model selectively focus on the most relevant parts of the input when generating each token.",
    improvedPromptExample: `“Explain the attention mechanism in transformers for a non-technical audience using a ‘meeting with many speakers’ analogy. Show how the model decides whose voice to focus on at each moment.”`,
  },
  {
    id: 6,
    sectionTags: [
      "1.4 Attention – How the Model Focuses",
    ],
    difficulty: "Medium",
    prompt: "Multi-head attention in transformers is best described as:",
    options: [
      { key: "A", text: "Using multiple GPUs to speed up training" },
      { key: "B", text: "Running several attention mechanisms in parallel to capture different relationships" },
      { key: "C", text: "A method to reduce the number of parameters in the attention layer" },
      { key: "D", text: "An approach that forces the model to attend equally to all tokens" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Multi-head attention runs several attention “heads” in parallel, each learning to focus on different aspects or relationships in the sequence, and then combines their outputs.

Option A is incorrect because multi-head attention is an architectural choice, not a GPU parallelization technique.
Option C is incorrect because it typically increases representational capacity rather than reducing parameters.
Option D is incorrect because individual heads still assign higher weights to some tokens and lower weights to others; they do not enforce equal attention.`,
    underlyingPrinciple: "Multi-Head Attention - A mechanism in which multiple attention heads learn complementary views of the input and combine their views to form a richer representation of the text.",
    improvedPromptExample: `“Explain multi-head attention in the style of a ‘team of specialists’ analogy, where each specialist focuses on a different pattern in the same document, and then the team combines their insights into a single summary.”`,
  },
  {
    id: 7,
    sectionTags: [
      "1.5 Parameters and Capacity – What the Numbers Really Mean",
    ],
    difficulty: "Medium",
    prompt: "Which statement best describes the role of parameters in a large language model?",
    options: [
      { key: "A", text: "They are individual examples of training data stored in memory" },
      { key: "B", text: "They are learned weights that encode statistical patterns in language" },
      { key: "C", text: "They are the fixed rules that govern grammar for the model" },
      { key: "D", text: "They are the hyperparameters that control the training process" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Parameters are the learned weights in a model that encode patterns and correlations from the training data. They are not raw data points but abstractions of the data’s structure.

Option A is incorrect because parameters are not literal copies of the training examples.
Option C is incorrect because parameters encode more than grammar rules; they capture a wide range of semantic and syntactic patterns.
Option D is incorrect because hyperparameters (like learning rate or batch size) are not the same as the model’s learned parameters.`,
    underlyingPrinciple: "Parameters as Capacity - The number and structure of parameters determine how much complexity and nuance a model can represent.",
    improvedPromptExample: `“Explain what ‘parameters’ mean in a large language model for a non-technical audience. Use an analogy like ‘knobs and dials’ that the model tuned during training, and describe how more parameters can lead to both more capability and more risk.”`,
  },
  {
    id: 8,
    sectionTags: [
      "1.5 Parameters and Capacity – What the Numbers Really Mean",
    ],
    difficulty: "Medium",
    prompt: "Why is it misleading to assume that ‘more parameters’ always mean ‘better’ in practical applications?",
    options: [
      { key: "A", text: "Larger models are always less accurate" },
      { key: "B", text: "Larger models always require less data to train" },
      { key: "C", text: "Larger models may be more capable but also more expensive, slower, and harder to control" },
      { key: "D", text: "Model size has no relation to performance at all" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:
While larger models can capture more complex patterns and often perform better on benchmarks, they are also more resource-intensive, slower, and can be harder to align or control. Organizations must weigh capability against cost, latency, and risk.

Option A is incorrect because larger models are not inherently less accurate; they often perform better on many tasks.
Option B is incorrect because larger models typically need at least as much data, if not more, to train effectively.
Option D is incorrect because there is a relationship between model size and performance, even if it is not linear or absolute.`,
    underlyingPrinciple: "Capacity Tradeoffs - More parameters increase potential capability but also cost, latency, and governance complexity.",
    improvedPromptExample: `“Compare the tradeoffs between a smaller and larger language model for a business use case. Explain in plain language how cost, speed, accuracy, and risk change as the parameter count increases.”`,
  },
  {
    id: 9,
    sectionTags: [
      "1.6 Tokens and Context Windows – The Model’s Working Memory",
    ],
    difficulty: "Medium",
    prompt: "In the context of LLMs, what is a token?",
    options: [
      { key: "A", text: "A full sentence" },
      { key: "B", text: "A unit of text such as a word, subword, or character, depending on the tokenizer" },
      { key: "C", text: "A paragraph of text" },
      { key: "D", text: "A complete document" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
A token is a unit of text determined by the tokenizer, which may be a whole word, part of a word, or even punctuation. The model processes and predicts tokens, not entire words or sentences by default.

Option A is incorrect because a sentence usually consists of multiple tokens.
Option C and D are incorrect because paragraphs and documents contain many tokens.`,
    underlyingPrinciple: "Tokens - The basic units of text that the model processes and predicts over.",
    improvedPromptExample: `“Explain what tokens are in language models using at least two examples, such as how the word ‘unbelievable’ might be split. Avoid technical notation and instead describe this in plain business language.”`,
  },
  {
    id: 10,
    sectionTags: [
      "1.6 Tokens and Context Windows – The Model’s Working Memory",
    ],
    difficulty: "Medium",
    prompt: "What is the context window in a large language model?",
    options: [
      { key: "A", text: "The total number of parameters in the model" },
      { key: "B", text: "The maximum number of tokens the model can consider at once when generating output" },
      { key: "C", text: "The size of the training dataset" },
      { key: "D", text: "The physical memory size of the GPU running the model" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
The context window is the maximum number of tokens the model can “see” at once as input when generating or continuing text. It acts like the model’s working memory.

Option A is incorrect because parameter count is about model size, not context length.
Option C is incorrect because the training dataset is usually far larger than the context window.
Option D is incorrect because GPU memory size influences how big a model you can run, but context window is a model design choice, not hardware memory itself.`,
    underlyingPrinciple: "Context Window - The sliding window of tokens the model can pay attention to at any given time, which constrains how much information it can use in a single pass.",
    improvedPromptExample: `“Explain the idea of a context window to business stakeholders using analogies like ‘what fits on a whiteboard’ or ‘how much conversation you can remember word-for-word.’ Highlight why extremely long documents may still require chunking.”`,
  },
  {
    id: 11,
    sectionTags: [
      "1.7 Training vs. Inference – How the Model Learns vs. How It Responds",
    ],
    difficulty: "Medium",
    prompt: "Which statement best describes the difference between training and inference for an LLM?",
    options: [
      { key: "A", text: "Training is when the model answers user questions; inference is when it updates its weights" },
      { key: "B", text: "Training is the process of learning patterns from data; inference is using the fixed model to generate outputs" },
      { key: "C", text: "Training and inference are interchangeable terms" },
      { key: "D", text: "Inference happens only during fine-tuning" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Training is when the model’s parameters are adjusted to fit patterns in the training data. Inference is when the trained model is used, without changing its weights, to generate outputs for new inputs.

Option A is incorrect because training is not about answering user questions in production; that is inference.
Option C is incorrect because the two phases are distinct in purpose and behavior.
Option D is incorrect because inference occurs whenever the model is being used to generate text, not just during fine-tuning.`,
    underlyingPrinciple: "Training vs. Inference - The separation between learning from data (training) and using the learned patterns to respond to new prompts (inference).",
    improvedPromptExample: `“Explain the difference between training and inference to a business leader using a ‘school vs. job’ analogy. Clearly separate the phase where the model learns from the phase where it serves end users.”`,
  },
  {
    id: 12,
    sectionTags: [
      "1.7 Training vs. Inference – How the Model Learns vs. How It Responds",
    ],
    difficulty: "Medium",
    prompt: "Why is it important for business stakeholders to understand that most production LLMs do not update their core weights during normal use?",
    options: [
      { key: "A", text: "Because it means the model cannot generate any new content" },
      { key: "B", text: "Because it clarifies that the model’s behavior is largely fixed and governed by training and fine-tuning, not by each user interaction" },
      { key: "C", text: "Because it proves that prompt engineering has no effect" },
      { key: "D", text: "Because it prevents the model from using any context windows" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Most production LLMs operate with fixed weights during inference, meaning their core behavior does not change with each user interaction. Understanding this helps stakeholders see why governance, fine-tuning, and prompt design matter so much.

Option A is incorrect because fixed weights do not prevent new content; they generate new content from learned patterns.
Option C is incorrect because prompt engineering significantly affects how the fixed model behaves on each request.
Option D is incorrect because context windows are part of how the model uses input, not whether it updates its weights.`,
    underlyingPrinciple: "Model Fixity at Inference - Inference uses a fixed model, so changes in behavior typically require new training, fine-tuning, or prompt strategies rather than expecting the model to ‘learn’ on the fly.",
    improvedPromptExample: `“Explain to a compliance team why a production LLM does not typically update its core weights in real time. Use this to motivate why governance happens through configuration, fine-tuning, and prompts, not through ad-hoc conversations.”`,
  },
  {
    id: 13,
    sectionTags: [
      "1.8 Loss Functions and Optimization – What It Means to 'Learn'",
    ],
    difficulty: "Medium",
    prompt: "What does the loss function measure during training of a language model?",
    options: [
      { key: "A", text: "The number of GPUs used" },
      { key: "B", text: "The difference between the model’s predictions and the actual target tokens" },
      { key: "C", text: "The amount of storage space taken by the model file" },
      { key: "D", text: "The number of users interacting with the model" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
The loss function quantifies how far off the model’s predictions are from the ground truth tokens during training. Lower loss means the model better matches the training data.

Option A is incorrect because GPU count is a hardware concern, not a learning signal.
Option C is incorrect because file size is a byproduct, not something the loss function optimizes.
Option D is incorrect because user count is unrelated to the training objective.`,
    underlyingPrinciple: "Loss Function - A mathematical measure of prediction error that the optimization process seeks to minimize.",
    improvedPromptExample: `“Explain what a loss function is in machine learning using a ‘grading a test’ analogy. Describe how the model iteratively reduces its mistakes over time, in plain business language.”`,
  },
  {
    id: 14,
    sectionTags: [
      "1.8 Loss Functions and Optimization – What It Means to 'Learn'",
    ],
    difficulty: "Medium",
    prompt: "Why might a very low training loss not always translate into good real-world performance?",
    options: [
      { key: "A", text: "Because low loss guarantees zero generalization" },
      { key: "B", text: "Because the model might overfit the training data and fail to generalize to new inputs" },
      { key: "C", text: "Because low loss only occurs when the data quality is poor" },
      { key: "D", text: "Because low loss means the model never memorized anything" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
If a model overfits the training data, it may achieve very low loss on that data but perform poorly on new, unseen inputs. Good models balance fitting the training data with generalization.

Option A is incorrect because low loss is not a guarantee of zero generalization; it’s a sign of close fit to training data.
Option C is incorrect because low loss is not inherently tied to poor data quality.
Option D is incorrect because memorization can be part of overfitting, not its opposite.`,
    underlyingPrinciple: "Overfitting vs. Generalization - Lower training loss is not enough; the model must also perform well on unseen data to be genuinely useful.",
    improvedPromptExample: `“Explain to a business audience why ‘training accuracy’ or low loss is not the only metric that matters. Use an analogy like students who memorize practice tests but struggle with new questions.”`,
  },
  {
    id: 15,
    sectionTags: [
      "1.9 Hallucinations – Confidently Wrong Answers",
    ],
    difficulty: "Medium",
    prompt: "In the context of LLMs, what is a hallucination?",
    options: [
      { key: "A", text: "A bug that causes the model to crash" },
      { key: "B", text: "A confident but factually incorrect output generated by the model" },
      { key: "C", text: "A temporary hardware glitch" },
      { key: "D",
        text: "An output that is too short for the user’s preference" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
A hallucination occurs when the model produces content that is fluent, confident-sounding, but factually incorrect or unsupported by reliable sources.

Option A is incorrect because hallucinations are not crashes; they are normal-looking outputs that are wrong.
Option C is incorrect because hardware glitches typically cause errors or failures, not plausible but incorrect text.
Option D is incorrect because output length is not the core issue; hallucinations are about correctness and grounding.`,
    underlyingPrinciple: "Hallucinations - Fluent but incorrect or unsupported outputs that can mislead if not checked or grounded.",
    improvedPromptExample: `“Explain AI hallucinations to a risk committee using plain language and at least two concrete examples. Clarify why ‘sounding confident’ is not the same as being correct.”`,
  },
  {
    id: 16,
    sectionTags: [
      "1.9 Hallucinations – Confidently Wrong Answers",
    ],
    difficulty: "Medium",
    prompt: "Which approach is most effective for reducing hallucinations in high-stakes use cases?",
    options: [
      { key: "A", text: "Using a higher temperature during generation" },
      { key: "B", text: "Grounding the model’s responses in verified external data sources" },
      { key: "C", text: "Removing all constraints from the prompt" },
      { key: "D", text: "Allowing the model to answer without any human review" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Grounding the model in verified external data (e.g., retrieval-augmented generation, databases, policies) helps anchor answers in real, checkable information, reducing hallucinations.

Option A is incorrect because increasing temperature typically increases variability and risk.
Option C is incorrect because removing constraints usually makes outputs less reliable.
Option D is incorrect because high-stakes contexts often require human review and governance, not less.`,
    underlyingPrinciple: "Grounding - Tying model outputs to trusted external data sources to reduce hallucinations and improve reliability.",
    improvedPromptExample: `“You are an AI assistant answering questions about company policy. For every answer, cite the exact section of the policy document you used. If the policy does not clearly address the question, say so explicitly and suggest escalation paths instead of guessing.”`,
  },
  {
    id: 17,
    sectionTags: [
      "1.10 Alignment and Safety – Who Is the Model Serving?",
    ],
    difficulty: "Medium",
    prompt: "What is the primary goal of alignment in AI systems?",
    options: [
      { key: "A", text: "To maximize model size and complexity" },
      { key: "B", text: "To ensure the model’s behavior is consistent with human values, organizational policies, and legal requirements" },
      { key: "C", text: "To make the model faster at inference time" },
      { key: "D", text: "To guarantee that the model never makes mistakes" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Alignment focuses on making sure the model behaves in ways that are consistent with human values, organizational norms, and legal constraints.

Option A is incorrect because alignment is not about model size.
Option C is incorrect because while performance matters, alignment is about behavior, not speed.
Option D is incorrect because no model is perfect; alignment reduces risk but does not eliminate mistakes.`,
    underlyingPrinciple: "Alignment - Ensuring AI behavior aligns with human and organizational objectives, values, and rules.",
    improvedPromptExample: `“Explain AI alignment to executive leadership in non-technical terms. Use examples that show how an unaligned model might create reputational, legal, or ethical risks even if it is technically powerful.”`,
  },
  {
    id: 18,
    sectionTags: [
      "1.10 Alignment and Safety – Who Is the Model Serving?",
    ],
    difficulty: "Medium",
    prompt: "Why is it risky to deploy a powerful but poorly aligned model in an enterprise setting?",
    options: [
      { key: "A", text: "Because it will always have slower response times" },
      { key: "B", text: "Because it might produce outputs that violate policies, regulations, or ethical norms" },
      { key: "C", text: "Because alignment has no impact on user trust" },
      { key: "D", text: "Because unaligned models cannot be fine-tuned" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
A poorly aligned model can generate outputs that are offensive, non-compliant, or legally risky, which can damage trust and create real business liabilities.

Option A is incorrect because response time is a performance issue, not the core alignment risk.
Option C is incorrect because alignment is tightly linked to user trust and safety.
Option D is incorrect because unaligned models can often be fine-tuned or constrained, though it may be difficult.`,
    underlyingPrinciple: "Enterprise Risk - Misaligned behavior in AI can create legal, ethical, and reputational risks, even if the model is otherwise capable.",
    improvedPromptExample: `“Describe to a risk and compliance team why deploying a very powerful but poorly aligned model can be dangerous. Give examples of how misaligned outputs could create legal, regulatory, or reputational problems.”`,
  },
  {
    id: 19,
    sectionTags: [
      "2.1 Temperature – Controlling Creativity",
    ],
    difficulty: "Medium",
    prompt: "In LLM decoding, what does the temperature parameter primarily control?",
    options: [
      { key: "A", text: "The length of the context window" },
      { key: "B", text: "The randomness of token selection during generation" },
      { key: "C", text: "The number of layers used during inference" },
      { key: "D", text: "The size of the vocabulary" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Temperature scales the logits before sampling, which changes how random or deterministic the token selection process is. Lower temperature makes outputs more deterministic; higher temperature increases variability and creativity.

Option A is incorrect because context window size is fixed at model design, not controlled by temperature.
Option C is incorrect because the number of layers used at inference is not directly controlled by temperature.
Option D is incorrect because vocabulary size is fixed by the tokenizer.`,
    underlyingPrinciple: "Temperature - A decoding parameter that trades off determinism against creativity in generated text.",
    improvedPromptExample: `“Generate three variants of the same executive summary with temperatures 0.2, 0.7, and 1.0. After each variant, briefly explain how the change in temperature affected the style, wording, and risk of hallucination.”`,
  },
  {
    id: 20,
    sectionTags: [
      "2.1 Temperature – Controlling Creativity",
      "2.2 Balancing Determinism and Creativity",
    ],
    difficulty: "Medium",
    prompt: "Which of the following strategies best balances creativity and reliability in a business-writing use case?",
    options: [
      { key: "A", text: "Always use temperature = 0 for all tasks" },
      { key: "B", text: "Use a low-to-moderate temperature and provide clear structure in the prompt" },
      { key: "C", text: "Use the maximum temperature available to increase novelty" },
      { key: "D", text: "Randomly change temperature on every request" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
A low-to-moderate temperature combined with structured prompts often gives a good balance between fluency, creativity, and reliability for business writing.

Option A is incorrect because temperature 0 can produce repetitive or overly rigid outputs.
Option C is incorrect because extremely high temperature may introduce too much randomness and risk of hallucination.
Option D is incorrect because randomly changing temperature makes behavior unpredictable and harder to govern.`,
    underlyingPrinciple: "Prompt + Temperature Synergy - Good structure and moderate randomness often produce the best balance for business contexts.",
    improvedPromptExample: `“Write a 400-word executive summary in a professional tone. Use a moderate temperature (around 0.5–0.7) and follow this outline: [OUTLINE]. At the end, briefly explain how the chosen temperature influences the tone and phrasing.”`,
  },
  {
    id: 21,
    sectionTags: [
      "2.2 Sampling Strategies – Top-K and Top-P",
    ],
    difficulty: "Medium",
    prompt: "Top-k sampling in language models is best described as:",
    options: [
      { key: "A", text: "Choosing the single most likely token every time" },
      { key: "B", text: "Sampling only from the k most probable tokens at each step" },
      { key: "C", text: "Sampling uniformly from all tokens in the vocabulary" },
      { key: "D", text: "Sampling from tokens whose cumulative probability reaches a threshold" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Top-k sampling restricts the model to sampling from the k most likely tokens at each step, which limits the tail and adds controlled randomness.

Option A is incorrect because choosing the single most likely token is greedy or argmax decoding, not top-k.
Option C is incorrect because top-k does not sample uniformly across the entire vocabulary.
Option D is incorrect because that describes top-p (nucleus) sampling, not top-k.`,
    underlyingPrinciple: "Top-K Sampling - A method of limiting sampling to the k most probable options to balance randomness and control.",
    improvedPromptExample: `“Explain top-k sampling in non-technical terms using a ‘shortlist’ analogy. Then, give a brief example scenario where increasing k might be helpful in brainstorming, and one where a lower k is safer.”`,
  },
  {
    id: 22,
    sectionTags: [
      "2.2 Sampling Strategies – Top-K and Top-P",
    ],
    difficulty: "Medium",
    prompt: "Top-p (nucleus) sampling differs from top-k primarily because it:",
    options: [
      { key: "A", text: "Always chooses the most likely token" },
      { key: "B", text: "Samples from the smallest set of tokens whose cumulative probability exceeds a threshold" },
      { key: "C", text: "Ignores token probabilities entirely" },
      { key: "D", text: "Always uses a fixed number of tokens" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Top-p sampling dynamically chooses the smallest set of tokens whose cumulative probability mass exceeds a chosen threshold p, and then samples from that set.

Option A is incorrect because always choosing the most likely token is greedy decoding.
Option C is incorrect because top-p explicitly relies on probabilities.
Option D is incorrect because the size of the set varies depending on how probability mass is distributed.`,
    underlyingPrinciple: "Top-P Sampling - A way to sample from a probability ‘nucleus’ instead of a fixed-size shortlist, adapting to the shape of the distribution.",
    improvedPromptExample: `“Explain top-p (nucleus) sampling to a non-technical audience using an analogy, such as choosing from a ‘core set’ of options that together make up most of the likelihood. Give a simple text example where top-p behaves differently from top-k.”`,
  },
  {
    id: 23,
    sectionTags: [
      "2.3 Controlling Length and Structure",
    ],
    difficulty: "Medium",
    prompt: "Which of the following prompt techniques best helps control the length and structure of an LLM-generated response?",
    options: [
      { key: "A", text: "Leaving the task completely open-ended" },
      { key: "B", text: "Specifying a target word count or range and providing an outline" },
      { key: "C", text: "Increasing the temperature as high as possible" },
      { key: "D", text: "Avoiding any mention of format or length" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Explicitly specifying the length (or length range) and providing an outline gives the model clearer guidance on the structure and size of the response.

Option A is incorrect because open-ended prompts tend to produce unpredictable lengths.
Option C is incorrect because higher temperature increases randomness, not structural control.
Option D is incorrect because omitting format and length removes important constraints.`,
    underlyingPrinciple: "Structural Control - Using explicit format and length instructions in prompts to shape outputs.",
    improvedPromptExample: `“Write a 250–300 word summary for senior leadership. Use the following outline with headings: [OUTLINE]. Ensure each heading has 1–2 sentences and the overall length stays within the requested range.”`,
  },
  {
    id: 24,
    sectionTags: [
      "2.3 Controlling Length and Structure",
    ],
    difficulty: "Medium",
    prompt: "Why is it often better to specify the desired output format (e.g., bullets, tables, sections) when prompting an LLM?",
    options: [
      { key: "A", text: "Because the model cannot generate paragraphs at all" },
      { key: "B", text: "Because format instructions help the model produce outputs that are easier to consume and compare" },
      { key: "C", text: "Because format has no relationship to the prompt’s clarity" },
      { key: "D", text: "Because it guarantees that the model will be factually correct" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Specifying format helps shape the output so it is easier to read, compare, and plug into downstream workflows (e.g., tables for comparison, bullets for lists).

Option A is incorrect because models can generate paragraphs.
Option C is incorrect because format is part of prompt clarity and guidance.
Option D is incorrect because good formatting does not guarantee factual correctness.`,
    underlyingPrinciple: "Format as Guidance - Output formatting instructions help align the model’s response with human needs and downstream use cases.",
    improvedPromptExample: `“Summarize the following policy into a two-column table with headers ‘Topic’ and ‘Key Rule.’ Keep each rule under 20 words and avoid legal jargon where possible.”`,
  },
  {
    id: 25,
    sectionTags: [
      "2.4 Guardrails and Constraints",
    ],
    difficulty: "Medium",
    prompt: "Which of the following is a good example of using constraints to reduce risk in an LLM-generated email draft?",
    options: [
      { key: "A", text: "“Write any email you like to the client.”" },
      { key: "B", text: "“Draft a polite, professional email that summarizes the attached meeting notes in 3–4 sentences, avoiding any promises about delivery dates.”" },
      { key: "C", text: "“Write an aggressive email that pressures the client into agreeing quickly.”" },
      { key: "D", text: "“Write the longest possible email to impress the client.”" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Prompt B uses constraints on tone, length, and content (e.g., avoiding promises), which reduces the risk of inappropriate or misleading communication.

Option A is incorrect because it provides no guardrails.
Option C is incorrect because aggressive tone may violate relationship or reputational norms.
Option D is incorrect because excessive length does not inherently improve quality and may introduce confusion.`,
    underlyingPrinciple: "Constraints as Guardrails - Explicit instructions about what to avoid or include help lower risk and improve relevance.",
    improvedPromptExample: `“Draft a concise, professional email to [RECIPIENT] summarizing the key decisions from the attached meeting notes. Limit the email to 5–7 sentences, avoid commitments to specific dates or budgets, and highlight any items that still need clarification.”`,
  },
  {
    id: 26,
    sectionTags: [
      "2.4 Guardrails and Constraints",
    ],
    difficulty: "Medium",
    prompt: "Why is it valuable to include ‘what not to do’ in prompts for sensitive use cases?",
    options: [
      { key: "A", text: "Because it guarantees the model will never make a mistake" },
      { key: "B", text: "Because explicit negative constraints reduce the likelihood of risky or off-limits content" },
      { key: "C", text: "Because it makes the model slower, which is always desirable" },
      { key: "D", text: "Because models cannot follow positive instructions without negative ones" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Stating what the model should avoid (e.g., “do not provide legal advice”) adds guardrails that reduce the chance of high-risk outputs.

Option A is incorrect because no prompt guarantees perfection.
Option C is incorrect because slower generation is not the goal; safer generation is.
Option D is incorrect because models can follow positive instructions, but adding negative constraints can improve safety in edge cases.`,
    underlyingPrinciple: "Negative Constraints - Clearly stating banned behaviors or topics helps the model avoid high-risk content in sensitive contexts.",
    improvedPromptExample: `“You are summarizing customer complaints for a leadership review. Provide a neutral, factual summary and explicitly avoid assigning blame to specific individuals or making legal conclusions.”`,
  },
  {
    id: 27,
    sectionTags: [
      "3.1 Evaluating Outputs – Beyond ‘Looks Good’",
    ],
    difficulty: "Medium",
    prompt: "Which of the following is an example of a structured evaluation criterion for LLM outputs?",
    options: [
      { key: "A", text: "“I like it when it sounds good.”" },
      { key: "B", text: "“The summary must correctly capture all three key decisions and list at least two risks.”" },
      { key: "C", text: "“The answer should be long enough.”" },
      { key: "D", text: "“The wording should feel right.”" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Option B defines clear, checkable criteria about decisions and risks. This makes evaluation more objective and repeatable.

Option A and D are subjective and vague.
Option C is incomplete because length alone is not a sufficient criterion.`,
    underlyingPrinciple: "Structured Evaluation - Using explicit, checkable criteria to judge LLM outputs improves consistency and accountability.",
    improvedPromptExample: `“After generating your answer, evaluate it against these criteria: (1) Are all three key decisions mentioned? (2) Are at least two risks identified? (3) Is the tone appropriate for senior leadership? If any criterion is not met, revise the answer.”`,
  },
  {
    id: 28,
    sectionTags: [
      "3.1 Evaluating Outputs – Beyond ‘Looks Good’",
    ],
    difficulty: "Medium",
    prompt: "Why is it useful to define evaluation criteria before generating LLM outputs in an important workflow?",
    options: [
      { key: "A", text: "Because it ensures the model will never hallucinate" },
      { key: "B", text: "Because it clarifies what ‘good’ looks like and makes it easier to compare outputs" },
      { key: "C", text: "Because it speeds up model training" },
      { key: "D", text: "Because the model cannot generate text without pre-defined criteria" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Defining criteria beforehand clarifies expectations, makes evaluation more objective, and helps choose among multiple candidate outputs.

Option A is incorrect because criteria do not eliminate hallucinations; they help detect and reduce them.
Option C is incorrect because evaluation criteria are not directly about training speed.
Option D is incorrect because the model can generate text without them; the criteria are for human evaluation.`,
    underlyingPrinciple: "Front-Loaded Evaluation - Defining success criteria up front improves the quality and reliability of downstream decisions.",
    improvedPromptExample: `“Before generating any content, list 3–5 specific criteria for what a ‘good’ answer looks like in this context. Then, after generation, rate the answer against each criterion on a 1–5 scale and summarize any gaps.”`,
  },
  {
    id: 29,
    sectionTags: [
      "3.2 Sampling Strategies – Top-K and Top-P",
    ],
    difficulty: "Medium",
    prompt: "How might you practically test different decoding settings (e.g., temperature, top-k, top-p) to choose defaults for a business application?",
    options: [
      { key: "A", text: "Randomly change settings every day" },
      { key: "B", text: "Run a small, controlled experiment comparing outputs with different settings against clear evaluation criteria" },
      { key: "C", text: "Use the highest possible randomness at all times" },
      { key: "D", text: "Never change the defaults and avoid measurement" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Running small, controlled experiments with defined criteria lets you compare different decoding settings and choose a balance of creativity and reliability that fits your use case.

Option A is incorrect because random changes undermine governance.
Option C is incorrect because maximum randomness is rarely appropriate for business contexts.
Option D is incorrect because refusing to adjust or measure settings misses opportunities to improve performance.`,
    underlyingPrinciple: "Experimentation - Treat decoding settings as tunable levers and use structured experiments to choose defaults.",
    improvedPromptExample: `“Generate three versions of a summary using different combinations of temperature and top-p. For each version, rate it on clarity, factual accuracy, and usefulness for a manager. Based on your ratings, recommend a default setting.”`,
  },
  {
    id: 30,
    sectionTags: [
      "3.2 Sampling Strategies – Top-K and Top-P",
    ],
    difficulty: "Medium",
    prompt: "Why is it important to document chosen decoding settings (e.g., temperature, top-k, top-p) for production use?",
    options: [
      { key: "A", text: "Because changing them has no effect at all" },
      { key: "B", text: "Because documenting settings supports reproducibility, governance, and troubleshooting" },
      { key: "C", text: "Because it guarantees that the model will never generate errors" },
      { key: "D", text: "Because documentation replaces the need for monitoring" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:
Documenting decoding settings makes it easier to reproduce behavior, audit decisions, and debug issues when outputs change or incidents occur.

Option A is incorrect because decoding settings do affect behavior.
Option C is incorrect because no setting guarantees zero errors.
Option D is incorrect because documentation complements, not replaces, monitoring and logging.`,
    underlyingPrinciple: "Governance and Auditability - Clear documentation of configuration choices supports responsible AI operations.",
    improvedPromptExample: `“Create a short configuration note for a production LLM summarizing the chosen temperature, top-k, and top-p settings. Explain in plain language why these values were chosen and what tradeoffs they represent.”`,
  },

    // ---------------------------------------------------------------------------
  // Chapter 2 – QUESTIONS (31–70) – populated from Questions chp2s.docx
  // ---------------------------------------------------------------------------
  {
    id: 31,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Financial Risk Extraction Scenario"],
    difficulty: "Medium",
    prompt: "Scenario: A financial institution wants an LLM to extract risk indicators from analyst reports. Accuracy > 95% is required. Which is the first step?",
    options: [
      { key: "A", text: "Add chain-of-thought" },
      { key: "B", text: "Build a RAG pipeline with structured schema outputs" },
      { key: "C", text: "Apply temperature decay" },
      { key: "D", text: "Fine-tune immediately" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

To reach >95% accuracy for extracting risk indicators from analyst reports, you must both ground the model in the correct source text and control the shape of the output. A Retrieval-Augmented Generation (RAG) pipeline retrieves the most relevant parts of each report, so the model works from the right evidence instead of its general training. A structured output schema (for example, JSON with fields like risk level, indicator, supporting text) makes the output consistent, machine-readable, and easier to validate.
Option A (Add chain-of-thought) might make reasoning more explicit but does not guarantee grounding or machine-readable structure.
Option C (Apply temperature decay) mainly affects randomness, not accuracy or grounding.
Option D (Fine-tune immediately) is costly and premature; you first want to see how far you can get with retrieval + schema.`,
    underlyingPrinciple: "Structured Extraction with RAG - Combining retrieval of relevant documents with a strict output schema so the model extracts information that is both grounded in evidence and consistently structured.",
    improvedPromptExample: `“You are an AI risk analyst. Using only the retrieved segments from the analyst report shown below, extract all explicit risk indicators into the following JSON schema:
{
"risks": [
{
"risk_level": "High | Medium | Low",
"indicator": "short title of the risk",
"supporting_text": "verbatim or closely paraphrased sentence from the report"
}
]
}
Do not add any information that is not clearly supported by the retrieved text. Respond with JSON only.”`,
  },
  {
    id: 32,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Enforcing JSON Compliance"],
    difficulty: "Medium",
    prompt: "Best pattern for forcing JSON compliance:",
    options: [
      { key: "A", text: "Zero-shot" },
      { key: "B", text: "Developer-mode priming" },
      { key: "C", text: "Output schema pattern" },
      { key: "D", text: "Style-transfer prompting" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

The output schema pattern explicitly defines a rigid structure (such as JSON fields and types) the model must follow. When you clearly specify the exact keys, allowed values, and any constraints, you greatly reduce the chance of malformed JSON and stray commentary that breaks downstream parsers.
Option A (Zero-shot) is simply a lack of examples; it doesn’t enforce structure.
Option B (Developer-mode priming) is vague and not a standard, reliable pattern.
Option D (Style-transfer prompting) focuses on tone and style, not strict structure.`,
    underlyingPrinciple: "Constrained Output Governance - Using explicit schemas to force the model into predictable, machine-readable formats, limiting variability and formatting errors.",
    improvedPromptExample: `“You are a data extraction engine. Respond only with valid JSON that matches this schema:
{
"customer_id": "string",
"issue_type": "Billing | Technical | Other",
"priority": "Low | Medium | High"
}
Do not include any explanatory text before or after the JSON, and do not add extra fields.”`,
  },
  {
    id: 33,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Summarizing Legal Cases"],
    difficulty: "Medium",
    prompt: "When designing a prompt chain for summarizing legal cases, you should:",
    options: [
      { key: "A", text: "Always use chain-of-thought" },
      { key: "B", text: "Use progressive summarization + retrieval" },
      { key: "C", text: "Use temperature > 1" },
      { key: "D", text: "Avoid examples" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Legal documents are long, technical, and high stakes. The most reliable pattern is to break the case into sections, summarize each section, and then merge those summaries into higher-level overviews—while using retrieval to pull in specific sections when needed. This avoids overloading the context window and preserves critical legal nuance.
Option A (Always use chain-of-thought) may help reasoning but does not solve length and nuance issues by itself.
Option C (Use temperature > 1) increases creativity and variability, which is risky in legal contexts.
Option D (Avoid examples) removes helpful guidance on tone and structure.`,
    underlyingPrinciple: "Progressive Summarization with Retrieval - A hierarchical approach that compresses long, complex legal documents step by step, while using retrieval to keep key clauses and facts accessible.",
    improvedPromptExample: `“You are a legal summarization assistant.
Break the case into logical sections (facts, procedural history, issues, holding, reasoning).
Summarize each section in 150–200 words.
Produce a final 400-word summary for non-lawyer stakeholders based only on your section summaries.
When answering follow-up questions, use retrieval to pull the most relevant sections from the original text and cite them.”`,
  },
  {
    id: 34,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Failure Risk in Multi-Step Reasoning"],
    difficulty: "Medium",
    prompt: "In multi-step reasoning, the highest failure risk is:",
    options: [
      { key: "A", text: "Step compounding" },
      { key: "B", text: "Latency" },
      { key: "C", text: "Cost" },
      { key: "D", text: "Token normalization" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

In multi-step reasoning, small errors at early steps propagate forward. Each subsequent step uses the previous result as input, so a tiny misinterpretation can become a large error by the end. This is the error cascade or step compounding problem.
Option B (Latency) is a performance concern, not the primary correctness risk.
Option C (Cost) is important but not about reasoning failure.
Option D (Token normalization) relates to numerical stability, not logic.`,
    underlyingPrinciple: "Error Cascades in Prompt Chains - The tendency for small mistakes in early steps of a reasoning chain to be amplified as later steps rely on those flawed outputs.",
    improvedPromptExample: `“Solve this business problem in numbered steps. After each step, (a) restate the intermediate result, and (b) check it against the original constraints. If any step appears inconsistent, correct it before moving on. At the end, summarize which checks prevented errors from compounding.”`,
  },
  {
    id: 35,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Mathematical Reasoning Technique"],
    difficulty: "Medium",
    prompt: "For mathematical reasoning, best method:",
    options: [
      { key: "A", text: "Few-shot worked examples" },
      { key: "B", text: "RAG" },
      { key: "C", text: "Embeddings" },
      { key: "D", text: "Higher top-p" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

LLMs are not symbolic math engines; they learn by patterns. Providing worked examples step-by-step solutions to similar problems shows the model the exact reasoning pattern you want it to mimic. This is more reliable than abstract instructions alone.
Option B (RAG) helps fetch formulas or references but doesn’t teach the model how to reason step by step.
Option C (Embeddings) are for similarity search, not direct math reasoning.
Option D (Higher top-p) increases randomness, which is harmful for math.`,
    underlyingPrinciple: "Example-Conditioned Math Reasoning - Using explicit, step-by-step demonstrations to guide the model’s approach to similar mathematical problems.",
    improvedPromptExample: `“Here are two worked examples of how to compute net present value (NPV), with all intermediate steps shown. After reading them, solve the new problem at the end by following the same reasoning pattern: write each step, the formula used, and the intermediate value before giving the final NPV. If any step is unclear, explain your assumption.”`,
  },
  {
    id: 36,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Prompt Collisions in Multi-Agent Systems"],
    difficulty: "Medium",
    prompt: "When prompt collisions occur in multi-agent systems, you should:",
    options: [
      { key: "A", text: "Increase temperature" },
      { key: "B", text: "Add agent role boundaries" },
      { key: "C", text: "Shrink context" },
      { key: "D", text: "Add random noise" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Prompt collisions happen when multiple agents with different goals share the same context and instructions, causing their roles to blur. Clear agent role boundaries—who does what, with what inputs and outputs—prevent them from interfering with each other.
Option A (Increase temperature) adds randomness and can make collisions worse.
Option C (Shrink context) may reduce confusion but doesn’t solve role ambiguity.
Option D (Add random noise) has no meaningful benefit.`,
    underlyingPrinciple: "Agent Isolation & Contracts - Defining explicit responsibilities, inputs, and outputs for each agent so their instructions do not collide or override one another.",
    improvedPromptExample: `“You are designing a two-agent system:
Agent A (Extractor): reads the source document and outputs only a structured JSON list of issues.
Agent B (Summarizer): takes Agent A’s JSON and writes a short narrative summary for executives.
Write separate prompts for each agent that: (1) clearly define its role, (2) specify allowed inputs and outputs, and (3) prohibit the agent from modifying the other’s responsibilities.”`,
  },
  {
    id: 37,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Reducing Hallucinations in a Biomedical Assistant"],
    difficulty: "Medium",
    prompt: "To reduce hallucinations in a biomedical assistant:",
    options: [
      { key: "A", text: "More personality" },
      { key: "B", text: "Lower temperature" },
      { key: "C", text: "Add authoritative citations through retrieval" },
      { key: "D", text: "Increase output length" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

In biomedical and clinical settings, hallucinations are dangerous. The model must be grounded in up-to-date, authoritative sources (guidelines, peer-reviewed studies, reputable databases). Retrieval plus citation forces answers to be based on real text instead of the model’s internal guesses.
Option A (More personality) changes tone, not factuality.
Option B (Lower temperature) reduces randomness but does not guarantee correctness.
Option D (Increase output length) may simply produce more fluent hallucinations.`,
    underlyingPrinciple: "Evidence-Based Grounding - Reducing hallucinations by forcing the model to rely on and cite high-quality, domain-specific reference texts.",
    improvedPromptExample: `“You are a biomedical assistant for clinicians. For each question:
Retrieve the top 5 most relevant abstracts or guidelines from our vetted corpus.
Answer only using information from these sources.
Provide citations in this format: (Source: [journal or guideline], Year, Section/Line).
If the corpus does not provide enough information, state that the answer is uncertain and recommend consulting a specialist.”`,
  },
  {
    id: 38,
    chapterId: "ch2",
    sectionTags: ["Ch2 – “Break-the-Pattern” Technique"],
    difficulty: "Medium",
    prompt: "Which is a “break-the-pattern” technique?",
    options: [
      { key: "A", text: "Prompt rewrites" },
      { key: "B", text: "Adversarial instructions" },
      { key: "C", text: "Keyword anchoring" },
      { key: "D", text: "Skeleton templates" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A “break-the-pattern” technique intentionally pushes the model out of its default habits with adversarial or counter-stereotypical instructions. This can expose weaknesses, bias, or hidden assumptions, and sometimes leads to clearer reasoning by forcing the model to rethink its usual patterns.
Option A (Prompt rewrites) refine instructions but may preserve the same pattern.
Option C (Keyword anchoring) reinforces patterns instead of breaking them.
Option D (Skeleton templates) impose structure, not disruption.`,
    underlyingPrinciple: "Pattern Disruption - Using unusual or challenging instructions to force the model to reconsider default response patterns and reveal robustness (or lack thereof).",
    improvedPromptExample: `“You usually provide optimistic project risk assessments. For this request, deliberately adopt the role of a highly skeptical risk officer whose job is to challenge every assumption. List at least five serious risks that contradict the default ‘everything will be fine’ narrative and explain why earlier reasoning might have missed them.”`,
  },
  {
    id: 39,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Ensuring Reproducibility in QA Workflows"],
    difficulty: "Medium",
    prompt: "To ensure reproducibility in QA workflows:",
    options: [
      { key: "A", text: "High temperature" },
      { key: "B", text: "Explicit deterministic structure" },
      { key: "C", text: "More few-shot examples" },
      { key: "D", text: "Retrieval-based rewriting" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Reproducibility means the same inputs yield the same outputs. You get this by combining deterministic decoding settings (e.g., temperature = 0, low top-p) with fixed structure (schemas and step-by-step formats). This reduces randomness and free-form variation.
Option A (High temperature) encourages diverse outputs.
Option C (More few-shot examples) may help quality but can increase variability.
Option D (Retrieval-based rewriting) helps grounding but does not guarantee identical outputs.`,
    underlyingPrinciple: "Deterministic Prompt Design - Combining strict structure with conservative decoding settings so outputs are consistent across runs.",
    improvedPromptExample: `“You are a QA assistant verifying policy compliance. Use temperature = 0 and top-p = 0.1. For each case, respond in this exact structure:
‘Compliant’ or ‘Non-compliant’
One sentence justification
Reference to policy section (e.g., “Policy §4.2”).
Run the same 10 cases three times and confirm the outputs are identical.”`,
  },
  {
    id: 40,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Translating Complex Documents"],
    difficulty: "Medium",
    prompt: "When translating complex documents, the best structure is:",
    options: [
      { key: "A", text: "“Translate this text”" },
      { key: "B", text: "Explicit constraints + glossary + examples" },
      { key: "C", text: "High top-p" },
      { key: "D", text: "Summarize first" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Professional translation for complex documents (legal, medical, technical) demands terminology consistency, structural fidelity, and controlled tone. Providing a domain glossary, style rules, and examples ensures the model translates key terms consistently and preserves headings, numbering, and definitions.
Option A (“Translate this text”) is too vague for high-stakes content.
Option C (High top-p) increases variation and risk of inconsistent wording.
Option D (Summarize first) may lose important detail.`,
    underlyingPrinciple: "Glossary-Controlled Translation - Using explicit terminology lists and style constraints to ensure accurate, consistent translation in specialized domains.",
    improvedPromptExample: `“You are a professional legal translator.
Use the attached bilingual glossary for all defined terms.
Preserve all clause numbers, headings, and defined terms exactly.
Maintain a formal legal tone.
Translate the following contract into [target language], and after the translation, list any terms that did not appear in the glossary and explain how you chose their translations.”`,
  },
  {
    id: 41,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Failure Mode of Unconditional Role Prompts"],
    difficulty: "Medium",
    prompt: "The primary failure mode of unconditional role prompts (“You are a…”) is:",
    options: [
      { key: "A", text: "Token drift" },
      { key: "B", text: "Role bleed-through" },
      { key: "C", text: "High variance" },
      { key: "D", text: "Too short outputs" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Simple role prompts like “You are a senior compliance officer” often degrade over long conversations: later user instructions override or dilute the role, so the model drifts back to a generic assistant voice. This is role bleed-through.
Option A (Token drift) is vague and not the standard term here.
Option C (High variance) is a symptom, not the specific failure mode.
Option D (Too short outputs) is unrelated.`,
    underlyingPrinciple: "Role Persistence Fragility - The tendency for role instructions to fade over time unless they are reinforced in higher-priority messages or periodically restated.",
    improvedPromptExample: `“System: You are a senior compliance officer for a bank. You must stay in this role for the entire session and decline to answer questions outside banking compliance.
Assistant (every 3 turns): Briefly confirm: ‘I am still acting as a senior compliance officer and will only answer compliance-related questions.’”`,
  },
  {
    id: 42,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Improving Long-Horizon Reasoning"],
    difficulty: "Medium",
    prompt: "Which improves long-horizon reasoning?",
    options: [
      { key: "A", text: "Self-critique loops" },
      { key: "B", text: "Higher temperature" },
      { key: "C", text: "Context-swap" },
      { key: "D", text: "Randomized few-shot examples" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

For long, complex tasks, a single forward pass often accumulates small errors. Self-critique loops ask the model to generate an initial answer, then step back and critique its own reasoning, correcting inconsistencies before finalizing. This improves stability over long reasoning chains.
Option B (Higher temperature) increases randomness.
Option C (Context-swap) is undefined here.
Option D (Randomized few-shot examples) can make behavior less stable.`,
    underlyingPrinciple: "Iterative Reasoning Stabilization - Enhancing reliability by having the model revisit and critique its own outputs, catching errors before they propagate.",
    improvedPromptExample: `“First, provide your best answer to this complex planning problem. Then, in a separate section titled ‘Self-Critique,’ identify at least three possible weaknesses or errors in your reasoning. Finally, provide a ‘Revised Answer’ that incorporates your corrections.”`,
  },
  {
    id: 43,
    chapterId: "ch2",
    sectionTags: ["Ch2 – What Output Schemas Reduce"],
    difficulty: "Medium",
    prompt: "Output schemas reduce:",
    options: [
      { key: "A", text: "Latency" },
      { key: "B", text: "Output variability" },
      { key: "C", text: "Memory load" },
      { key: "D", text: "Embedding distance" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Output schemas constrain the structure and, often, the length and type of each field. This dramatically reduces variability in format and makes outputs predictable.
Option A (Latency) is only indirectly affected.
Option C (Memory load) is primarily an infrastructure concern.
Option D (Embedding distance) is unrelated.`,
    underlyingPrinciple: "Structured Output Control - Using predefined formats to minimize unpredictable variation, making outputs easier to parse, compare, and evaluate.",
    improvedPromptExample: `“You are generating incident reports. Always respond with this structure:
Incident Title (one sentence)
Severity (Low | Medium | High)
Root Cause (max 2 sentences)
Recommended Action (max 3 bullet points)
Do not add additional sections or free-form text outside this structure.”`,
  },
  {
    id: 44,
    chapterId: "ch2",
    sectionTags: ["Ch2 – To make a model follow strict rules in a creative task"],
    difficulty: "Medium",
    prompt: "To make a model follow strict rules in a creative task:",
    options: [
      { key: "A", text: "Increase temperature" },
      { key: "B", text: "Reduce temperature" },
      { key: "C", text: "Add step-by-step constraints" },
      { key: "D", text: "Disable reasoning" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

Creative tasks can easily drift from constraints. By breaking the task into phases—such as “first outline, then write,” or “define allowed topics, then generate”—you ensure rules are applied before creativity.
Option A (Increase temperature) encourages rule-breaking variation.
Option B (Reduce temperature) helps somewhat but doesn’t guarantee adherence to rules.
Option D (Disable reasoning) is not realistic and may reduce quality.`,
    underlyingPrinciple: "Constraint-First Creative Prompting - Structuring creative tasks so that rules and boundaries are established before generative content is produced.",
    improvedPromptExample: `“You are designing marketing copy.
Step 1: List the mandatory constraints: brand voice, prohibited claims, required disclaimer text.
Step 2: Propose 3 headline ideas that obey all constraints.
Step 3: For the best headline, write a 50-word supporting paragraph that also respects every constraint. If any constraint would be violated, stop and explain the conflict instead of generating copy.”`,
  },
  {
    id: 45,
    chapterId: "ch2",
    sectionTags: ["Ch2 – When a Rewrite Agent Is Useful"],
    difficulty: "Medium",
    prompt: "A rewrite agent is useful when:",
    options: [
      { key: "A", text: "Model refuses tasks" },
      { key: "B", text: "Adding chain-of-thought" },
      { key: "C", text: "Enforcing style or structure" },
      { key: "D", text: "Improving embeddings" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

A rewrite agent specializes in transforming an existing draft into a different tone, style, or structure—e.g., from technical to executive summary, or from free text to a structured format. This offloads polishing from the main reasoning agent.
Option A (Model refuses tasks) is more about safety or policy.
Option B (Adding chain-of-thought) concerns reasoning, not rewriting.
Option D (Improving embeddings) is unrelated.`,
    underlyingPrinciple: "Transformational Prompting - Using a dedicated agent to reshape content while preserving core meaning, ensuring consistent style and formatting.",
    improvedPromptExample: `“Rewrite the following technical incident report into a concise executive summary for senior leadership.
Requirements:
150–200 words
No jargon without brief explanation
Clear problem–impact–resolution structure
Preserve facts but change tone and structure to match the requirements.”`,
  },
  {
    id: 46,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Pattern That Reduces Verbosity"],
    difficulty: "Medium",
    prompt: "Which pattern reduces verbosity?",
    options: [
      { key: "A", text: "CoT" },
      { key: "B", text: "Output throttle" },
      { key: "C", text: "Progressive summarization" },
      { key: "D", text: "Adversarial mode" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

An output throttle explicitly limits length (“max 100 words,” “exactly 3 bullets,” etc.). Clear quantitative limits are more reliable than vague instructions like “be concise.”
Option A (CoT) usually makes responses longer.
Option C (Progressive summarization) reduces length across stages but is more about large documents.
Option D (Adversarial mode) is unrelated.`,
    underlyingPrinciple: "Prompt-Level Length Governance - Using explicit, measurable constraints on output length to keep responses brief and focused.",
    improvedPromptExample: `“Summarize this customer complaint in at most 2 sentences and no more than 40 words total, focusing only on the root cause and the customer’s requested resolution.”`,
  },
  {
    id: 47,
    chapterId: "ch2",
    sectionTags: ["Ch2 – “Ground Truth Leakage” in Workflows"],
    difficulty: "Medium",
    prompt: "When designing AI workflows, “ground truth leakage” refers to:",
    options: [
      { key: "A", text: "Output revealing training data" },
      { key: "B", text: "Retrieval injecting private data" },
      { key: "C", text: "Eval data contaminating training" },
      { key: "D", text: "Prompts revealing system instructions" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

Ground truth leakage occurs when evaluation data is accidentally included in training. The model may then “memorize” answers, giving unrealistically high scores during evaluation—your tests no longer measure true generalization.
Option A (Output revealing training data) is a different privacy concern.
Option B (Retrieval injecting private data) relates to RAG security, not eval leakage.
Option D (Prompts revealing system instructions) is prompt injection/information disclosure.`,
    underlyingPrinciple: "Evaluation Data Leakage — The contamination of test sets by training data, leading to overly optimistic performance metrics that do not reflect real-world capability.",
    improvedPromptExample: `“Explain to a data science team what ‘ground truth leakage’ means in the context of LLM evaluation. Provide two concrete examples of how test questions could accidentally appear in training data, and propose process controls to prevent this (e.g., data splits, source tracking).”`,
  },
  {
    id: 48,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Hallucination-Resistant Evaluation Pipeline"],
    difficulty: "Medium",
    prompt: "A hallucination-resistant evaluation pipeline relies on:",
    options: [
      { key: "A", text: "Unsupervised loss" },
      { key: "B", text: "Human evaluation + grounded references" },
      { key: "C", text: "Nucleus sampling" },
      { key: "D", text: "Glossary expansion" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A robust evaluation pipeline for hallucinations has human reviewers compare model outputs to trusted reference documents. The reviewers check whether each claim is supported, unsupported, or contradicted. This is far more reliable than purely automatic metrics.
Option A (Unsupervised loss) is a training signal, not a hallucination test.
Option C (Nucleus sampling) is a decoding method.
Option D (Glossary expansion) helps terminology but not hallucination measurement.`,
    underlyingPrinciple: "Human-in-the-Loop Grounded Evaluation - Assessing model outputs by comparing them against authoritative references, with human judgment determining factual correctness.",
    improvedPromptExample: `“You are an evaluator. For each model answer and its associated reference passage, label each sentence as ‘Supported by reference,’ ‘Contradicted by reference,’ or ‘Not found in reference.’ Provide a short note for any sentence that is contradicted or unsupported.”`,
  },
  {
    id: 49,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Detecting Reasoning Failure"],
    difficulty: "Medium",
    prompt: "To detect reasoning failure, add:",
    options: [
      { key: "A", text: "Temperature increase" },
      { key: "B", text: "Rationality tags (“<thinking>…”)" },
      { key: "C", text: "Unknown token penalty" },
      { key: "D", text: "Prompt negation" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Adding explicit tags like <thinking> and <answer> makes the model’s reasoning visible and separable from its final output. This structure makes it easier to inspect where reasoning went wrong and, if desired, to allow another model or a human to review the reasoning section.
Option A (Temperature increase) makes failures more random.
Option C (Unknown token penalty) is not a standard practice here.
Option D (Prompt negation) is vague and not about inspection.`,
    underlyingPrinciple: "Visible Reasoning Traceability — Structuring prompts so that the model’s internal reasoning is surfaced in a distinct section, enabling inspection and debugging of logic.",
    improvedPromptExample: `“For this complex policy decision, first write your reasoning between <thinking> and </thinking> tags. Then write only the final decision and a one-sentence justification between <answer> and </answer>. Do not reference the <thinking> section in the final answer.”`,
  },
  {
    id: 50,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Best Prompt for Summarizing Medical Research"],
    difficulty: "Medium",
    prompt: "In summarizing medical research, best prompt depends on:",
    options: [
      { key: "A", text: "Simplistic zero-shot" },
      { key: "B", text: "Domain-specific chain-of-thought" },
      { key: "C", text: "Freeform creative style" },
      { key: "D", text: "High temperature fluency" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Medical research summarization requires both correct structure (background, methods, results, limitations) and accurate use of medical concepts. A domain-specific CoT prompts the model to reason in a disciplined, clinically appropriate way.
Option A (Simplistic zero-shot) is rarely enough for nuanced papers.
Option C (Freeform creative style) risks distorting findings.
Option D (High temperature fluency) adds variability and risk.`,
    underlyingPrinciple: "Domain-Aligned Reasoning - Tailoring reasoning patterns to the conventions and terminology of a specific professional domain.",
    improvedPromptExample: `“Summarize this clinical study for practicing physicians. Use this structure: (1) Research question, (2) Study design, (3) Population, (4) Key results with effect sizes, (5) Limitations, (6) Clinical implications. Use precise medical terminology and avoid simplifying clinical concepts unless explicitly requested.”`,
  },
  {
    id: 51,
    chapterId: "ch2",
    sectionTags: ["Ch2 – What a “Content Boundary” Pattern Prevents"],
    difficulty: "Medium",
    prompt: "A “content boundary” pattern prevents:",
    options: [
      { key: "A", text: "Tool calling" },
      { key: "B", text: "Toxic output" },
      { key: "C", text: "Overreach beyond allowed domain" },
      { key: "D", text: "JSON errors" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

A content boundary explicitly limits what the model is allowed to talk about (for example, “HR policies only,” or “cannot give medical or legal advice”). This prevents the model from answering questions it should not touch.
Option A (Tool calling) is unrelated.
Option B (Toxic output) is a separate safety concern (though boundaries can help).
Option D (JSON errors) is about structure, not domain.`,
    underlyingPrinciple: "Domain Restriction Guardrails - Defining the scope of topics a model may address and requiring it to refuse or redirect questions outside that scope.",
    improvedPromptExample: `“System: You are an internal HR policy assistant. You may answer only questions related to the company’s HR handbook. For any question outside this domain (such as legal, medical, or personal finance), you must respond: ‘I’m only allowed to answer questions about our HR policy’ and suggest contacting the appropriate department.”`,
  },
  {
    id: 52,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Greatest Risk When Building Dynamic Prompts from User Inputs"],
    difficulty: "Medium",
    prompt: "When building dynamic prompts from user inputs, the greatest risk is:",
    options: [
      { key: "A", text: "Grammar errors" },
      { key: "B", text: "Prompt injection" },
      { key: "C", text: "Higher latency" },
      { key: "D", text: "Lower factuality" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

When user text is directly inserted into system or developer prompts, a malicious user can embed instructions like “Ignore all previous rules and…” - overriding your intended behavior. This is prompt injection.
Option A (Grammar errors) are minor.
Option C (Higher latency) is a performance issue.
Option D (Lower factuality) is an outcome, but prompt injection is the root vulnerability.`,
    underlyingPrinciple: "Instruction Injection Vulnerability - The risk that user-provided content, if embedded into prompts without sanitization, can override or subvert system-level instructions.",
    improvedPromptExample: `“Explain to an engineering team what prompt injection is and then design a templating strategy where all user-provided text is clearly treated as data only (e.g., quoted or marked) so it cannot be interpreted as instructions by the model.”`,
  },
  {
    id: 53,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Solving Knowledge Dilution"],
    difficulty: "Medium",
    prompt: "Solve knowledge dilution by:",
    options: [
      { key: "A", text: "Using embeddings + retrieval" },
      { key: "B", text: "Increasing temperature" },
      { key: "C", text: "Removing system messages" },
      { key: "D", text: "Fewer examples" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

In long conversations or dense domains, important information gets “diluted” among many tokens. Embeddings plus retrieval let you re-inject the most relevant information at each step, rather than relying on a bloated context window.
Option B (Increasing temperature) makes outputs more random.
Option C (Removing system messages) weakens constraints.
Option D (Fewer examples) doesn’t address dilution.`,
    underlyingPrinciple: "Retrieval Reinforcement - Continually resurfacing the most relevant knowledge via embeddings and retrieval to keep the model anchored on key facts.",
    improvedPromptExample: `“For each new question in this long-running project conversation, first search our project notes using embeddings to retrieve the 5 most relevant passages. Show them briefly, then answer the question using only those passages as your source of truth.”`,
  },
  {
    id: 54,
    chapterId: "ch2",
    sectionTags: ["Ch2 – What State Compression Helps With"],
    difficulty: "Medium",
    prompt: "State compression helps with:",
    options: [
      { key: "A", text: "Rewriting large prompts compactly" },
      { key: "B", text: "Increasing output diversity" },
      { key: "C", text: "Lowering hallucination" },
      { key: "D", text: "Expanding context window" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

State compression summarizes a long history or large instruction set into a shorter representation that preserves key decisions, constraints, and facts. This allows the conversation or workflow to continue without exceeding context limits.
Option B (Increasing output diversity) is not the primary goal.
Option C (Lowering hallucination) may be an indirect benefit but not the definition.
Option D (Expanding context window) is architectural, not prompt based.`,
    underlyingPrinciple: "Conversation State Summarization - Compressing long interaction histories into concise summaries that preserve essential information while saving tokens.",
    improvedPromptExample: `“Summarize our entire conversation so far in no more than 250 tokens. Your summary must include: (1) the user’s main goal, (2) key decisions already made, and (3) constraints we must not violate later. We will use this summary as the new context instead of the full history.”`,
  },
  {
    id: 55,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Best Way to Tune a Classification Prompt"],
    difficulty: "Medium",
    prompt: "The best way to tune a classification prompt is:",
    options: [
      { key: "A", text: "Use forced-choice enumerations" },
      { key: "B", text: "Use open-ended answers" },
      { key: "C", text: "Add creativity" },
      { key: "D", text: "Reduce constraint density" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

Classification is easiest when you force the model to choose from a small set of explicit labels. This reduces ambiguity and makes evaluation straightforward.
Option B (Open-ended answers) makes labeling harder and less consistent.
Option C (Add creativity) is unnecessary and harmful here.
Option D (Reduce constraint density) works against clarity.`,
    underlyingPrinciple: "Forced-Decision Classification - Constraining outputs to a fixed set of labels so the model must choose one and only one category.",
    improvedPromptExample: `“Classify the customer message below into exactly one category:
A: Billing issue
B: Technical problem
C: Account change
D: Other
Respond only with the letter (A, B, C, or D). If multiple categories seem relevant, choose the best single match.”`,
  },
  {
    id: 56,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Evaluating Prompt Versions"],
    difficulty: "Medium",
    prompt: "When evaluating prompt versions, you should:",
    options: [
      { key: "A", text: "Test one variable at a time" },
      { key: "B", text: "Test all at once" },
      { key: "C", text: "Use high-stakes tasks" },
      { key: "D", text: "Avoid benchmarks" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

To understand which change improves performance, you must run controlled experiments, changing only one variable (e.g., adding a schema, changing temperature) while keeping everything else constant.
Option B (Test all at once) makes results impossible to interpret.
Option C (Use high-stakes tasks) is not required and may be risky.
Option D (Avoid benchmarks) is the opposite of best practice.`,
    underlyingPrinciple: "Controlled Prompt Experimentation - Varying one factor at a time against a fixed benchmark set to measure the true impact of each change.",
    improvedPromptExample: `“You have two versions of a ticket classification prompt: one with a schema and one without. Design an experiment with 50 held-out tickets where the only difference is the presence or absence of the schema. Report accuracy, consistency, and JSON validity for each version and explain which change drove the difference.”`,
  },
  {
    id: 57,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Best Solution for Multilingual Hallucination"],
    difficulty: "Medium",
    prompt: "The best solution for multilingual hallucination:",
    options: [
      { key: "A", text: "Multilingual CoT" },
      { key: "B", text: "Temperature zero" },
      { key: "C", text: "Retrieval from native corpora" },
      { key: "D", text: "Few-shot monolingual examples only" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

When working in languages other than English, models may have weaker internal representations. Grounding answers in native-language corpora (e.g., legal texts in Portuguese for Brazilian law) makes answers more accurate and idiomatic.
Option A (Multilingual CoT) improves reasoning style but not necessarily factual grounding.
Option B (Temperature zero) reduces randomness but not language coverage gaps.
Option D (Monolingual few-shot examples only) helps somewhat but lacks external evidence.`,
    underlyingPrinciple: "Native-Language Grounding - Using retrieval from high-quality corpora in the user’s language to anchor model responses and reduce hallucinations.",
    improvedPromptExample: `“You are answering questions about Brazilian labor law in Portuguese. Before answering, retrieve the most relevant excerpts from our Portuguese legal corpus. Base your answer only on those excerpts and cite the article and paragraph numbers in Portuguese. Do not rely on English summaries.”`,
  },
  {
    id: 58,
    chapterId: "ch2",
    sectionTags: ["Ch2 – What a “Sandboxed Prompt” Is"],
    difficulty: "Medium",
    prompt: "A “sandboxed prompt” is:",
    options: [
      { key: "A", text: "Prompt unable to call tools" },
      { key: "B", text: "Prompt that cannot affect system state" },
      { key: "C", text: "Prompt inside limited token budget" },
      { key: "D", text: "Meta-prompt that defines its own rules" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A sandboxed prompt allows the model to analyze or discuss content but not to execute actions or change system state no tool calls, no external side effects. This is crucial when analyzing potentially dangerous instructions or code.
Option A (Unable to call tools) is part of it, but the key is “no side effects.”
Option C (Limited token budget) is unrelated.
Option D (Meta-prompt) is a different concept.`,
    underlyingPrinciple: "Isolated Execution Context - Restricting a model’s abilities so it can reason about content without performing actions that change systems, data, or environments.",
    improvedPromptExample: `“You are operating in a sandbox. You may analyze, explain, and critique the code shown below, but you must not attempt to run, modify, or suggest any commands that would alter external systems. If a user asks you to execute or deploy something, explain why you cannot do so in this sandboxed environment.”`,
  },
  {
    id: 59,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Knowledge-Intensive Agents"],
    difficulty: "Medium",
    prompt: "When designing knowledge-intensive agents, always:",
    options: [
      { key: "A", text: "Increase temperature" },
      { key: "B", text: "Use multi-step retrieval" },
      { key: "C", text: "Add creative reasoning" },
      { key: "D", text: "Reduce memory footprint" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Complex, knowledge-heavy questions often require more than one retrieval pass. A multi-step retrieval pipeline first gathers broad context, then refines the search based on the initial findings, and finally retrieves highly specific passages.
Option A (Increase temperature) does not help knowledge coverage.
Option C (Add creative reasoning) may harm factuality.
Option D (Reduce memory footprint) is an infrastructure concern.`,
    underlyingPrinciple: "Iterative Retrieval Refinement - Using multiple retrieval stages to progressively narrow down the most relevant information for complex queries.",
    improvedPromptExample: `“For this difficult research question, follow these steps:
Retrieve 10 broad, relevant documents and summarize them.
From your summary, identify 3–5 key subtopics.
For each subtopic, perform a second retrieval to get highly specific passages.
Answer the question using only those second-stage passages, citing each subtopic’s sources.”`,
  },
  {
    id: 60,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Avoiding Overfitting on Examples"],
    difficulty: "Medium",
    prompt: "To avoid overfitting on examples:",
    options: [
      { key: "A", text: "Use adversarial few-shot" },
      { key: "B", text: "Use zero-shot with constraints" },
      { key: "C", text: "Add more examples" },
      { key: "D", text: "High top-p" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Too many similar examples in a prompt can cause the model to mimic specific patterns instead of generalizing (overfitting). A strong zero-shot prompt with clear constraints forces the model to apply general rules rather than copying example-specific quirks.
Option A (Adversarial few-shot) is useful for robustness testing, not necessarily overfitting.
Option C (Add more examples) can make overfitting worse.
Option D (High top-p) adds randomness, not generalization.`,
    underlyingPrinciple: "Constraint-First Generalization - Relying on clear rules and constraints instead of many similar examples to encourage flexible, general behavior.",
    improvedPromptExample: `“Without any examples, classify each customer review as ‘Positive,’ ‘Negative,’ or ‘Mixed’ using the following rules:
‘Positive’ if the overall sentiment is clearly favorable.
‘Negative’ if the overall sentiment is clearly unfavorable.
‘Mixed’ if there is a balance of strong positives and strong negatives.
Respond with only one of the three labels and apply these definitions consistently.”`,
  },
  {
    id: 61,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Compressing Long Text"],
    difficulty: "Medium",
    prompt: "When compressing long text, best method:",
    options: [
      { key: "A", text: "Blind summarization" },
      { key: "B", text: "Chunk → summarize → merge (recursive)" },
      { key: "C", text: "Single-pass rewrite" },
      { key: "D", text: "Top-k sampling" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Recursive summarization handles long documents by dividing them into chunks, summarizing each, then summarizing the summaries. This preserves structure and important detail better than a single “giant” summary.
Option A (Blind summarization) risks missing key points and context.
Option C (Single-pass rewrite) struggles with very long inputs.
Option D (Top-k sampling) is unrelated.`,
    underlyingPrinciple: "Hierarchical Compression / Recursive Summarization - A multi-level summarization strategy that progressively compresses long documents while preserving essential structure and content.",
    improvedPromptExample: `“Summarize this 40-page report using recursive summarization:
Break the report into sections (e.g., per chapter).
Summarize each section in 150–200 words.
Summarize all section summaries into one 800-word executive summary.
Label each stage clearly (‘Section Summary,’ ‘Final Summary’).”`,
  },
  {
    id: 62,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Forcing Citation Quality"],
    difficulty: "Medium",
    prompt: "To force citation quality:",
    options: [
      { key: "A", text: "“Cite your sources”" },
      { key: "B", text: "Retrieval + citation schema" },
      { key: "C", text: "Heat penalty" },
      { key: "D", text: "Lower temperature" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Simply saying “cite your sources” is not enough. You must pair retrieval with a structured citation schema—for example, document ID, section or line numbers—so that each claim can be checked against specific text.
Option A (“Cite your sources”) is too vague.
Option C (Heat penalty) is not a standard technique here.
Option D (Lower temperature) helps determinism, not citation structure.`,
    underlyingPrinciple: "Schema-Based Grounding - Enforcing structured citation formats tied to retrieved passages so claims are auditable and verifiable.",
    improvedPromptExample: `“Answer the user’s question using only the retrieved passages. For every factual statement, provide a citation in this format: [Source: <doc_id>, Lines: <start–end>]. If you cannot find support in the retrieved text, mark the statement as ‘Unsupported’ and do not present it as fact.”`,
  },
  {
    id: 63,
    chapterId: "ch2",
    sectionTags: ["Ch2 – When Prompt Chaining Leads to Compounding Variance"],
    difficulty: "Medium",
    prompt: "When prompt chaining leads to compounding variance, apply:",
    options: [
      { key: "A", text: "Deterministic mode" },
      { key: "B", text: "Higher temperature" },
      { key: "C", text: "Zero-shot" },
      { key: "D", text: "Partial context reset" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

Each step in a chain introduces randomness if sampling is not controlled. Deterministic settings (temperature ≈ 0, low top-p) suppress random variation, so differences between runs are minimized across the entire chain.
Option B (Higher temperature) increases variance.
Option C (Zero-shot) changes examples but not decoding variance.
Option D (Partial context reset) may help with context length, not variance per se.`,
    underlyingPrinciple: "Variance Suppression in Pipelines - Using deterministic decoding across multi-step workflows to prevent random divergence from accumulating.",
    improvedPromptExample: `“You will execute a four-step analysis pipeline (extract → cluster → summarize → recommend). Use temperature = 0 and top-p = 0.1 for every step so that running the pipeline multiple times with the same input yields identical outputs.”`,
  },
  {
    id: 64,
    chapterId: "ch2",
    sectionTags: ["Ch2 – In RAG QA, When Answers Contradict Retrieval"],
    difficulty: "Medium",
    prompt: "In RAG QA, when answers contradict retrieval:",
    options: [
      { key: "A", text: "Increase temperature" },
      { key: "B", text: "Add “You must cite lines”" },
      { key: "C", text: "Remove examples" },
      { key: "D", text: "Add more documents blindly" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

If the model contradicts its retrieved context, it’s not truly grounded. Requiring line-level citations ties each claim to specific retrieved text, making contradiction easier to detect and discouraging unsupported inventions.
Option A (Increase temperature) makes things worse.
Option C (Remove examples) doesn’t address grounding.
Option D (Add more documents blindly) may introduce more noise.`,
    underlyingPrinciple: "Citation-Linked Grounding - Forcing each claim to be backed by specific, referenced lines in retrieved documents to reduce unsupported assertions.",
    improvedPromptExample: `“When answering questions using RAG, for each sentence in your answer include a citation in the format (DocID: X, Lines: Y–Z). If you cannot find supporting lines, write: ‘I do not have sufficient information in the retrieved documents to answer this part.”`,
  },
  {
    id: 65,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Best Practice for Translating Legal Contracts"],
    difficulty: "Medium",
    prompt: "Best practice for translating legal contracts:",
    options: [
      { key: "A", text: "Simplify" },
      { key: "B", text: "Add domain glossary + structural constraints" },
      { key: "C", text: "Increase top-p" },
      { key: "D", text: "Remove schema" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Legal translation must preserve exact structure, clause numbering, and defined terms. A domain glossary ensures terms like “indemnification” or “force majeure” are translated consistently, while structural constraints ensure clauses and definitions are preserved.
Option A (Simplify) risks altering legal meaning.
Option C (Increase top-p) increases variation and risk.
Option D (Remove schema) removes helpful structure.`,
    underlyingPrinciple: "Terminology Control & Structural Fidelity - Ensuring legal meaning and contract structure remain intact through glossary-driven, structure-preserving translation.",
    improvedPromptExample: `“Translate this contract into [target language] using the provided legal glossary. Preserve all clause numbers, headings, defined term capitalization, and cross-references exactly. Do not simplify or paraphrase legal concepts. If you encounter a term not in the glossary, flag it and explain your chosen translation.”`,
  },
  {
    id: 66,
    chapterId: "ch2",
    sectionTags: ["Ch2 – When Prompt Output Becomes Unstable"],
    difficulty: "Medium",
    prompt: "When prompt output becomes unstable:",
    options: [
      { key: "A", text: "Increase temperature" },
      { key: "B", text: "Add forced reasoning steps" },
      { key: "C", text: "Reduce constraints" },
      { key: "D", text: "Introduce schema + fixed pattern" },
    ],
    correctOptionKey: "D",
    explanation: `Explanation:

Unstable outputs usually lack structural anchors. Adding a schema and fixed response pattern reduces variability and gives the model a “template” to fill, stabilizing results.
Option A (Increase temperature) worsens instability.
Option B (Add forced reasoning steps) might help clarity but not structure.
Option C (Reduce constraints) usually increases variability.`,
    underlyingPrinciple: "Stability Through Structural Anchoring - Using fixed templates and schemas so the model produces consistent, predictable outputs even on complex tasks.",
    improvedPromptExample: `“Your responses must follow this exact format:
Summary (2 sentences)
Key Risks (3 bullet points)
Recommended Actions (3 bullet points)
Do not add any other sections or text. Use temperature = 0
Role-Primed Chain Usage.”`,
  },
  {
    id: 67,
    chapterId: "ch2",
    sectionTags: ["Ch2 – A role-primed chain"],
    difficulty: "Medium",
    prompt: "A role-primed chain is best for:",
    options: [
      { key: "A", text: "Long reasoning" },
      { key: "B", text: "Persona-based tasks" },
      { key: "C", text: "Numerical accuracy" },
      { key: "D", text: "Reducing hallucination" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Role priming is most useful when you want the model to adopt a persona—for example, “senior HR manager,” “CISO,” or “technical recruiter”—so the advice and language match that viewpoint.
Option A (Long reasoning) is more about CoT and loops.
Option C (Numerical accuracy) is better handled by tools.
Option D (Reducing hallucination) is not the primary benefit.`,
    underlyingPrinciple: "Persona Conditioning - Shaping the model’s behavior by assigning it a consistent, domain-appropriate role across a conversation or workflow.",
    improvedPromptExample: `“You are a senior technical recruiter. For each candidate profile, assess them using this structure: (1) Summary of experience, (2) Strengths, (3) Risks, (4) Recommended interview focus. Keep your comments aligned with how a real senior recruiter would speak.”`,
  },
  {
    id: 68,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Tracking Improvement Across Prompt Iterations"],
    difficulty: "Medium",
    prompt: "To track improvement across prompt iterations:",
    options: [
      { key: "A", text: "Freeform scoring" },
      { key: "B", text: "Benchmark dataset + rubric" },
      { key: "C", text: "Random sampling" },
      { key: "D", text: "Only subjective judgment" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

To know whether a new prompt is better, you need a fixed set of test cases (benchmark dataset) and an explicit scoring rubric (accuracy, completeness, format compliance, etc.). This allows objective comparison over time.
Option A (Freeform scoring) is subjective and inconsistent.
Option C (Random sampling) lacks consistency.
Option D (Only subjective judgment) is unreliable.`,
    underlyingPrinciple: "Empirical Prompt Evaluation - Using standardized test sets and rubrics to measure the performance impact of prompt changes over time.",
    improvedPromptExample: `“Create a benchmark set of 50 representative user queries for our helpdesk assistant. For each prompt version, score the outputs against a rubric (Correctness, Clarity, Policy Compliance, Format) and produce a comparison table that shows which version performs better in each dimension.”`,
  },
  {
    id: 69,
    chapterId: "ch2",
    sectionTags: ["Ch2 – What Fact-Checking Loops Rely On"],
    difficulty: "Medium",
    prompt: "Fact-checking loops rely on:",
    options: [
      { key: "A", text: "Regenerating text" },
      { key: "B", text: "Comparing generation against structured references" },
      { key: "C", text: "Temperature adjustments" },
      { key: "D", text: "Role prompting" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

In a fact-checking loop, the model (or another checker model) compares generated text against structured references retrieved documents, databases, or structured facts to identify unsupported or contradictory statements.
Option A (Regenerating text) without checking doesn’t guarantee correctness.
Option C (Temperature adjustments) doesn’t inherently improve factual alignment.
Option D (Role prompting) is not specific to fact-checking.`,
    underlyingPrinciple: "Reference-Based Verification - Validating generated content by systematically comparing it to authoritative sources and correcting discrepancies.",
    improvedPromptExample: `“Given a model-generated answer and a set of retrieved reference passages, highlight any sentences that are not supported by the references. For each unsupported sentence, either (a) rewrite it so it is fully supported, or (b) remove it and explicitly note that it was unsubstantiated.”`,
  },
  {
    id: 70,
    chapterId: "ch2",
    sectionTags: ["Ch2 – Enforcing Compliance in Multi-Agent Chains"],
    difficulty: "Medium",
    prompt: "To enforce compliance in multi-agent chains:",
    options: [
      { key: "A", text: "Randomize agent order" },
      { key: "B", text: "Add agent boundaries + message contracts" },
      { key: "C", text: "Add creativity" },
      { key: "D", text: "Increase output length" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Compliance in multi-agent systems requires that each agent: (1) has a clearly defined role, (2) receives only the inputs it needs, and (3) produces outputs in a defined format. Message contracts specify exactly what each agent can send and receive, and boundaries prevent agents from stepping outside their responsibilities.
Option A (Randomize agent order) introduces chaos.
Option C (Add creativity) can harm compliance.
Option D (Increase output length) is irrelevant.`,
    underlyingPrinciple: "Multi-Agent Governance & Contracts - Using explicit role definitions and structured message formats to keep agent chains predictable, auditable, and policy-compliant.",
    improvedPromptExample: `“Design a three-agent workflow for regulatory reporting:
Agent 1 (Extractor) outputs only structured JSON of facts from documents.
Agent 2 (Checker) validates the JSON against policy rules and returns either ‘Valid’ or a list of violations.
Agent 3 (Reporter) produces a human-readable report based only on Agent 1’s JSON and Agent 2’s validation flags.
For each agent, write a prompt that defines its role, allowed inputs, expected outputs, and explicit prohibitions (e.g., Agent 3 may not modify the JSON).”`,
  },

  // ---------------------------------------------------------------------------
  // Chapter 3 – QUESTIONS (71–100) – populated from Questions chp3.docx
  // ---------------------------------------------------------------------------
  {
    id: 71,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Agent Drift Root Cause"],
    difficulty: "Medium",
    prompt: "Primary cause of agent drift:",
    options: [
      { key: "A", text: "Temperature" },
      { key: "B", text: "Lack of bounded memory" },
      { key: "C", text: "Output formatting errors" },
      { key: "D", text: "Over-retrieval" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Agent drift happens when an agent slowly “forgets” its original goals, constraints, or conversation context and starts behaving more like a generic model. The main cause is lack of bounded, well-managed memory. As prompts grow, older instructions fall out of the context window or are weakly summarized, so the agent no longer has a reliable anchor to its original role and rules.
A. Temperature can add variability, but with strong, consistently re-injected constraints, behavior can remain stable.
C. Output formatting errors create parsing issues but do not by themselves cause the agent to forget its mission.
D. Over-retrieval can confuse the agent with noisy context, but drift is fundamentally about losing earlier constraints.`,
    underlyingPrinciple: "Memory Decay & Constraint Erosion - The tendency of agent behavior to deviate from its original instructions over time as earlier context is lost, truncated, or poorly summarized, unless key constraints are regularly re-anchored.",
    improvedPromptExample: `“At the end of each step, summarize your current role, goals, and constraints into a 60-token ‘agent state’ and include it at the start of the next request so you stay aligned with the original mission.”`,
  },
  {
    id: 72,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Reliable Tool Calling Design"],
    difficulty: "Medium",
    prompt: "Best design for tool-calling reliability:",
    options: [
      { key: "A", text: "Natural language tool instructions" },
      { key: "B", text: "JSON-defined function signatures" },
      { key: "C", text: "High temperature" },
      { key: "D", text: "Freeform schema" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Tool calls are most reliable when the model is given clear, structured function signatures—for example, a JSON schema describing tool name, parameters, types, and required fields. This reduces ambiguity about what the tool expects and makes it easier for the model to generate valid, machine-callable arguments.
A. Natural language tool instructions are often too vague and lead to malformed calls.
C. High temperature makes tool selection and arguments less predictable.
D. Freeform schema defeats the purpose of structure and increases error rates.`,
    underlyingPrinciple: "Formalized Tool Invocation - Defining tools with explicit, machine-readable signatures (names, parameters, types) so the model can call them deterministically and safely.",
    improvedPromptExample: `“You may call the getAccountBalance tool using only this JSON function signature:
{"tool":"getAccountBalance","args":{"account_id":"string","as_of_date":"YYYY-MM-DD"}}.
Return a tool call JSON with no extra text whenever a user asks for a balance.”`,
  },
  {
    id: 73,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Chunk Size Effects in Retrieval"],
    difficulty: "Medium",
    prompt: "When using embeddings for retrieval, chunk size primarily affects:",
    options: [
      { key: "A", text: "Tokenization time" },
      { key: "B", text: "Recall vs precision tradeoff" },
      { key: "C", text: "Hallucination probability" },
      { key: "D", text: "Temperature" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Chunk size controls how much text each embedding represents. Larger chunks are more likely to contain the relevant passage somewhere inside (higher recall) but include more noise per result (lower precision). Smaller chunks are more focused (higher precision) but can miss context or split important information across chunks (lower recall).
A. Tokenization time changes only marginally compared to the retrieval tradeoff.
C. Hallucination probability is indirectly affected through retrieval quality but not directly governed by chunk size.
D. Temperature
is a decoding parameter, unrelated to chunk size.`,
    underlyingPrinciple: "Chunk Granularity Optimization - Choosing chunk sizes that balance coverage (recall) and focus (precision) so retrieved text is both relevant and specific.",
    improvedPromptExample: `“Explain to a product team how 200-token, 500-token, and 2,000-token chunk sizes affect recall and precision in a RAG system and recommend a chunking strategy for policy documents where precision is critical.”`,
  },
  {
    id: 74,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Risks of Higher Embedding Dimensionality"],
    difficulty: "Medium",
    prompt: "Increasing vector dimensionality risks:",
    options: [
      { key: "A", text: "Overfitting semantics" },
      { key: "B", text: "Lower recall" },
      { key: "C", text: "Higher computational cost without quality gain" },
      { key: "D", text: "Prompt injection" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

Beyond a certain point, increasing embedding dimensionality gives diminishing returns. You pay more in storage, RAM, and search time for each vector without a proportional gain in semantic quality. That means your infrastructure costs go up while relevance may barely improve.
A. Overfitting semantics
is more influenced by training data and model design than vector size alone.
B. Lower recall is not a direct outcome of dimensionality; recall depends on retrieval strategy.
D. Prompt injection is a prompt security issue, not a vector dimension issue.`,
    underlyingPrinciple: "Diminishing Returns in Embedding Geometry - The observation that beyond a moderate dimensionality, extra dimensions increase cost and complexity more than they improve semantic discrimination.",
    improvedPromptExample: `“Compare the infrastructure cost and retrieval quality of using 384-, 768-, and 1024-dimensional embeddings for our knowledge base. Recommend a dimension that balances relevance quality with compute and storage cost.”`,
  },
  {
    id: 75,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Latency Spikes in RAG"],
    difficulty: "Medium",
    prompt: "Latency spikes in RAG are usually caused by:",
    options: [
      { key: "A", text: "Model decoding" },
      { key: "B", text: "Retrieval bottlenecks" },
      { key: "C", text: "Tool misalignment" },
      { key: "D", text: "Token penalties" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

In many production RAG systems, the slowest part is retrieval, particularly vector search over large indexes, cross-encoder reranking, or slow data stores. Even if the LLM is fast, a slow retrieval layer will cause noticeable latency spikes.
A. Model decoding contributes but is usually relatively stable for given token counts.
C. Tool misalignment may cause logical errors, not consistent latency spikes.
D. Token penalties are decoding tweaks, not major latency drivers.`,
    underlyingPrinciple: "Retrieval Path Optimization - Designing and tuning the retrieval pipeline (indexes, search algorithms, caches) to minimize latency and keep end-to-end response times predictable.",
    improvedPromptExample: `“Analyze the latency profile of our RAG system and identify which retrieval steps (vector search, reranking, I/O) are the main bottlenecks. Propose at least three optimizations, such as approximate nearest neighbor search or better caching.”`,
  },
  {
    id: 76,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Role of a Hallucination Filter Agent"],
    difficulty: "Medium",
    prompt: "A hallucination filter agent should:",
    options: [
      { key: "A", text: "Rephrase output" },
      { key: "B", text: "Validate claims against retrieval corpus" },
      { key: "C", text: "Lower temperature" },
      { key: "D", text: "Add chain-of-thought" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A hallucination filter agent should act like a fact-checker. It compares each claim in the model’s answer against the retrieved documents or other ground-truth sources. Claims that cannot be supported should be flagged, corrected, or removed.
A. Rephrase output improves wording but not factuality.
C. Lower temperature reduces randomness but cannot guarantee truth.
D. Add chain-of-thought can actually amplify confident but wrong reasoning if not grounded.`,
    underlyingPrinciple: "Reference-Guided Validation — Systematically checking generated content against trusted sources and treating unsupported statements as suspect.",
    improvedPromptExample: `“You are a hallucination filter. For each sentence in this answer, mark it as ‘Supported’, ‘Contradicted’, or ‘Not Found’ based on the retrieved passages provided. Suggest edits to remove or correct any ‘Contradicted’ or ‘Not Found’ statements.”`,
  },
  {
    id: 77,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Improving Agent Handoffs"],
    difficulty: "Medium",
    prompt: "Which technique improves agent handoffs?",
    options: [
      { key: "A", text: "Token pruning" },
      { key: "B", text: "Structured message contracts" },
      { key: "C", text: "High top-p" },
      { key: "D", text: "Randomization" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Agent handoffs work best when each agent knows exactly what format it will receive and what format it must produce. A message contract (for example, a JSON schema) ensures that Agent B can reliably consume whatever Agent A outputs, reducing misinterpretation and errors.
A. Token pruning might reduce cost but does not define interfaces.
C. High top-p makes outputs less predictable and handoffs less reliable.
D. Randomization degrades consistency.`,
    underlyingPrinciple: "Formalized Agent Interoperability - Defining clear, structured interfaces (inputs/outputs) so multiple agents can collaborate without breaking each other’s assumptions.",
    improvedPromptExample: `“Agent A: Output your findings strictly as
{"risks":[{"id":"string","description":"string","severity":"Low|Medium|High"}]}.
Agent B: Assume you always receive that schema; if the input deviates, return an error instead of guessing.”`,
  },
  {
    id: 78,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Best Caching Strategy for High-Traffic Agents"],
    difficulty: "Medium",
    prompt: "The best cache strategy for high-traffic agents:",
    options: [
      { key: "A", text: "Full generation caching" },
      { key: "B", text: "Embedding-level caching" },
      { key: "C", text: "Disable caching" },
      { key: "D", text: "Temperature caching" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Embedding-level caching stores the embeddings for frequently seen queries or documents, so you don’t recompute them every time. This speeds up vector search and reduces compute load, particularly in high-traffic scenarios.
A. Full generation caching only helps when many users ask nearly identical questions.
C. Disable caching wastes opportunities for performance gains.
D. Temperature caching
is not a meaningful concept; temperature is a runtime parameter.`,
    underlyingPrinciple: "Semantic Cache Optimization - Reusing computed embeddings and retrieval results to reduce latency and compute cost, especially for common or repeated inputs.",
    improvedPromptExample: `“Design a caching strategy where embeddings for the top 5,000 most common queries and documents are precomputed and cached, and retrieval checks the cache before running any new embedding computations.”`,
  },
  {
    id: 79,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Retrieval Scoring Focus in Production RAG"],
    difficulty: "Medium",
    prompt: "In production RAG, retrieval scoring should focus on:",
    options: [
      { key: "A", text: "Cosine similarity" },
      { key: "B", text: "Token proximity" },
      { key: "C", text: "Top-k only" },
      { key: "D", text: "Chunk length" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

Most vector-based semantic search systems use cosine similarity (or a closely related metric) to measure how similar two embeddings are. It provides a robust way to score semantic closeness, which is the core of retrieval ranking in RAG.
B. Token proximity
is more specific to keyword/lexical methods.
C. Top-k only is a selection strategy, not a scoring metric.
D. Chunk length affects chunk design, not scoring itself.`,
    underlyingPrinciple: "Vector Similarity Scoring - Using mathematical measures like cosine similarity to rank candidate documents by how semantically close they are to a query.",
    improvedPromptExample: `“Explain to a non-technical product manager how cosine similarity is used to rank RAG documents and illustrate with a simple example of three candidate chunks whose embeddings produce different cosine scores.”`,
  },
  {
    id: 80,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Why Agent Feedback Loops Fail"],
    difficulty: "Medium",
    prompt: "Agent feedback loops fail when:",
    options: [
      { key: "A", text: "Agents share retrieval stores" },
      { key: "B", text: "Response validation is missing" },
      { key: "C", text: "Using JSON" },
      { key: "D", text: "Temperature is low" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

In an agent feedback loop, one agent’s output is fed into another for correction or refinement. If there is no validation step—no check against policy, ground truth, or quality standards—agents can reinforce each other’s mistakes, leading to compounding errors.
A. Agents sharing retrieval stores can be fine, as long as validation exists.
C. Using JSON
is helpful for structure, not a failure mode.
D. Low temperature generally increases stability, not failure.`,
    underlyingPrinciple: "Validation & Correction Layering - Ensuring that iterative agent workflows include explicit validation checkpoints, so errors are caught and corrected rather than amplified.",
    improvedPromptExample: `“After each agent produces its output, run a ‘Validator Agent’ that checks: (1) factual grounding, (2) schema compliance, and (3) policy compliance. The pipeline proceeds only if the validator explicitly marks the step as ‘Approved’.”`,
  },
  {
    id: 81,
    chapterId: "ch3",
    sectionTags: ["Ch3 – How Models Choose Tools"],
    difficulty: "Medium",
    prompt: "During tool-calling, the model chooses tools using:",
    options: [
      { key: "A", text: "Rule-based heuristics" },
      { key: "B", text: "Learned representations" },
      { key: "C", text: "Random selection" },
      { key: "D", text: "Temperature adjustments" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

During training or fine-tuning with tool examples, models learn to associate language patterns (“What is my account balance?”) with appropriate tool calls (e.g., getAccountBalance). This is based on internal learned representations, not hard-coded rules or randomness.
A. Rule-based heuristics may exist outside the model (orchestrator), but the model itself relies on learned patterns.
C. Random selection would be unsafe and unreliable.
D. Temperature adjustments influence randomness of outputs, not the fundamental mapping between language and tools.`,
    underlyingPrinciple: "Tool Affordance Learning - The process by which a model learns which tools are “afforded” by particular input patterns, and when to invoke them.",
    improvedPromptExample: `“Here is a list of tools and examples of user requests that should trigger each one. Learn these patterns and, for each new query, either (a) select the best-matching tool with arguments in JSON, or (b) respond in natural language if no tool is appropriate.”`,
  },
  {
    id: 82,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Assigning Multiple Tools to an Agent"],
    difficulty: "Medium",
    prompt: "Assigning multiple tools to an agent requires:",
    options: [
      { key: "A", text: "Tool priority rules" },
      { key: "B", text: "Higher sampling" },
      { key: "C", text: "Zero-shot prompting" },
      { key: "D", text: "No constraints" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

When an agent has access to several tools, priority rules resolve conflicts—e.g., “call search before calculator,” “call retrieval before summarization.” Without such rules, the model may choose tools inconsistently or in the wrong order.
B. Higher sampling increases randomness in tool selection.
C. Zero-shot prompting may work, but without priorities, behavior is unstable.
D. No constraints almost guarantees unpredictable tool usage.`,
    underlyingPrinciple: "Hierarchical Tool Governance - Defining which tools to call first, under what conditions, and which ones to back off if earlier tools fail, so tool use is predictable.",
    improvedPromptExample: `“You have three tools: searchDocs, calculator, and summarizeText. Always: (1) call searchDocs to gather evidence; (2) call calculator only if numeric computation is required; (3) call summarizeText last. Never call tools out of this order.”`,
  },
  {
    id: 83,
    chapterId: "ch3",
    sectionTags: ["Ch3 – When RAG Hallucination Occurs"],
    difficulty: "Medium",
    prompt: "RAG hallucination occurs when:",
    options: [
      { key: "A", text: "Too many documents retrieved" },
      { key: "B", text: "Model overrides retrieved truth" },
      { key: "C", text: "Retrieval fails completely" },
      { key: "D", text: "All of the above" },
    ],
    correctOptionKey: "D",
    explanation: `Explanation:

RAG hallucinations have several pathways:
Too many documents: The model is flooded with noisy or conflicting content and picks the wrong details.
Model overrides retrieved truth: The model “prefers” a plausible narrative over what the documents say.
Retrieval fails: If nothing relevant is retrieved, the model has no grounding and may guess.
Because all three contribute, “all of the above” is correct.`,
    underlyingPrinciple: "Multi-Source Hallucination Pathways - The variety of ways a RAG system can drift from ground truth due to retrieval noise, absence of evidence, or model preference for plausibility over accuracy.",
    improvedPromptExample: `“When answering, explicitly state whether (1) the retrieved documents agree, (2) they conflict, or (3) they do not address the question. If they conflict or are missing, label the answer as ‘Uncertain’ and avoid fabricating details.”`,
  },
  {
    id: 84,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Purpose of Memory Replay Buffers"],
    difficulty: "Medium",
    prompt: "Memory replay buffers in agents help:",
    options: [
      { key: "A", text: "Reduce cost" },
      { key: "B", text: "Maintain short-term context across steps" },
      { key: "C", text: "Improve embeddings" },
      { key: "D", text: "Increase top-p" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Memory replay buffers store compact representations of recent interactions or state, so agents can maintain continuity over multiple steps without re-injecting the entire history. This reduces context loss and drift.
A. Reduce cost is a side benefit but not the core goal.
C. Improve embeddings is unrelated; embeddings are model level.
D. Increase top-p is a decoding tweak, not a memory strategy.`,
    underlyingPrinciple: "State Compression for Multi-Step Agents - Keeping a concise but informative memory of recent steps so long workflows remain coherent and on-mission.",
    improvedPromptExample: `“Before moving to the next step in this workflow, compress the last three turns into a 100-token ‘memory snapshot’ that captures goals, decisions, and constraints. Use only this snapshot as historical context in the next step.”`,
  },
  {
    id: 85,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Biggest Threat to Production Agents"],
    difficulty: "Medium",
    prompt: "The biggest threat to production agents:",
    options: [
      { key: "A", text: "High temperature" },
      { key: "B", text: "Prompt injection" },
      { key: "C", text: "JSON formatting" },
      { key: "D", text: "Chunking strategy" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Prompt injection occurs when user or external content is inserted into a prompt in a way that can override or subvert system instructions (e.g., “ignore your previous rules”). In production, this is a major security and safety risk—far more serious than simple formatting errors or slightly high temperature.
A. High temperature can reduce stability but is controllable.
C. JSON formatting causes technical failures, not systemic compromise.
D. Chunking strategy affects retrieval quality, not direct security.`,
    underlyingPrinciple: "Instruction Integrity & Prompt Security - Protecting system messages and control logic from being overridden by untrusted user or document content.",
    improvedPromptExample: `“Explain to an engineering team what prompt injection is, then design a prompt template where all user-provided text is clearly marked as ‘data only’ and cannot be interpreted as instructions by the model.”`,
  },
  {
    id: 86,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Hybrid RAG Systems"],
    difficulty: "Medium",
    prompt: "A hybrid RAG system uses:",
    options: [
      { key: "A", text: "Keyword search" },
      { key: "B", text: "Vector + keyword search" },
      { key: "C", text: "Vision models" },
      { key: "D", text: "Temperature decay" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Hybrid RAG combines semantic retrieval (vectors) with lexical retrieval (keyword or BM25). Semantic search finds conceptually similar text; keyword search ensures exact matches for names, IDs, or legal phrases. Together, they improve both recall and precision.
A. Keyword search alone misses paraphrased content.
C. Vision models may be used in multimodal systems, but are not the core of hybrid text retrieval.
D. Temperature decay is unrelated to retrieval.`,
    underlyingPrinciple: "Dual-Channel Retrieval Enhancement - Leveraging both semantic and lexical search to capture different kinds of relevance signals.",
    improvedPromptExample: `“Design a hybrid retrieval strategy where each query is first run against (1) a vector index and (2) a keyword index, then the top 5 from each are merged and reranked to produce the final context for the LLM.”`,
  },
  {
    id: 87,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Role of a Guardian Agent"],
    difficulty: "Medium",
    prompt: "A “guardian agent” in a production chain does:",
    options: [
      { key: "A", text: "Execute business logic" },
      { key: "B", text: "Enforce policies" },
      { key: "C", text: "Increase creativity" },
      { key: "D", text: "Reduce cost" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A guardian agent is placed near the end of the pipeline to enforce safety, legal, and business policies. It reviews content for restricted topics, confidential data, hate or harassment, regulatory violations, and rejects or modifies outputs before they reach users.
A. Execute business logic is usually handled by other agents or systems.
C. Increase creativity is the opposite of its intended purpose.
D. Reduce cost is incidental, not primary.`,
    underlyingPrinciple: "Policy Enforcement Layering - Introducing a dedicated agent that screens outputs for compliance and rejects or corrects unsafe or non-compliant content.",
    improvedPromptExample: `“You are a Guardian Agent. For each candidate answer, check: (1) safety policy, (2) confidentiality rules, and (3) regulatory guidelines. Return either ‘Approved’ or ‘Rejected’ with a short explanation and, for rejections, a suggested safe rewrite.”`,
  },
  {
    id: 88,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Scheduler Role in Agent Orchestration"],
    difficulty: "Medium",
    prompt: "In agent orchestration, the scheduler decides:",
    options: [
      { key: "A", text: "Which agent gets memory" },
      { key: "B", text: "Which agent runs next" },
      { key: "C", text: "The temperature" },
      { key: "D", text: "Embedding dimensionality" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

The scheduler controls the execution order of agents: which agent is called when, based on workflow logic, state, or conditions. This is key to orchestrating complex multi-agent pipelines (e.g., Retrieval → Analyzer → Verifier → Stylist).
A. Which agent gets memory may be part of orchestration, but is not the scheduler’s core definition.
C. The temperature is a model parameter, not usually owned by the scheduler per se.
D. Embedding dimensionality is a design-time choice, not a runtime scheduling decision.`,
    underlyingPrinciple: "Workflow Sequencing - Coordinating the order in which agents execute to implement a coherent, repeatable process.",
    improvedPromptExample: `“Define a scheduling plan for a four-agent pipeline (Retriever, Analyst, Verifier, Stylist), describing the exact conditions under which each agent is invoked and how control passes from one to the next.”`,
  },
  {
    id: 89,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Citation-Verifier Agent"],
    difficulty: "Medium",
    prompt: "A citation-verifier agent:",
    options: [
      { key: "A", text: "Generates citations" },
      { key: "B", text: "Checks citations against source lines" },
      { key: "C", text: "Rewrites JSON" },
      { key: "D", text: "Controls temperature" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A citation-verifier agent does not generate citations; it checks that existing citations truly match the referenced text. For each citation, it ensures the quoted or paraphrased content appears in the cited lines and flags mismatches.
A. Generates citations describes an authoring agent.
C. Rewrites JSON is unrelated.
D. Controls temperature
is a decoding concern.`,
    underlyingPrinciple: "Line-Level Grounding Verification - Validating that cited passages that support the claims they are attached to, reducing false or decorative citations.",
    improvedPromptExample: `“Given an answer with inline citations and the source documents, verify each citation: confirm that the cited lines support the sentence. Mark each as ‘Correct’, ‘Incorrect’, or ‘Unsupported’, and suggest corrections where needed.”`,
  },
  {
    id: 90,
    chapterId: "ch3",
    sectionTags: ["Ch3 – High-Reliability RAG Deployment Pattern"],
    difficulty: "Medium",
    prompt: "Best way to deploy a high-reliability RAG system:",
    options: [
      { key: "A", text: "Retrieval → LLM rewrite → cite" },
      { key: "B", text: "Retrieval → LLM QA → verification" },
      { key: "C", text: "LLM → retrieval → rewrite" },
      { key: "D", text: "Zero-shot" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A robust pattern is:
Retrieval:
Fetch the most relevant chunks.
LLM QA: Generate an answer based only on those chunks.
Verification: Run a separate check (agent or process) to ensure the answer is grounded and policy compliant.
This layering balances usefulness and safety.
A. Retrieval → LLM rewrite → cite can lead to decorative, unverified citations.
C. LLM → retrieval → rewrite reverses the logical order and encourages hallucination first.
D. Zero-shot ignores grounding entirely.`,
    underlyingPrinciple: "Three-Stage Grounded QA Pipeline — Structuring RAG as retrieval, grounded answering, then verification to maximize factual reliability.",
    improvedPromptExample: `“Implement a three-stage pipeline: (1) retrieve top 8 passages, (2) answer the user’s question using only those passages, and (3) verify that each claim is supported by at least one passage. Only output answers that pass verification.”`,
  },
  {
    id: 91,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Handling Tool Errors"],
    difficulty: "Medium",
    prompt: "Best practice for tool errors:",
    options: [
      { key: "A", text: "Retry with exponential backoff" },
      { key: "B", text: "Regenerate prompt" },
      { key: "C", text: "Increase context" },
      { key: "D", text: "Reduce schema complexity" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

In production, many tool failures are temporary (network, server load). Retrying with exponential backoff (e.g., wait 0.5s, then 1s, then 2s) increases reliability without overwhelming downstream systems.
B. Regenerate prompt for every error is noisy and may not fix the root cause.
C. Increase context does not address tool availability.
D. Reduce schema complexity may help development, but not transient outages.`,
    underlyingPrinciple: "Robust Tool Invocation - Designing agents to handle transient tool failures gracefully with retries and fallback strategies.",
    improvedPromptExample: `“If a tool call fails, log the error code and retry up to 3 times with delays of 0.5, 1, and 2 seconds. If all retries fail, return a structured error message explaining that the external service is temporarily unavailable.”`,
  },
  {
    id: 92,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Scaling Agents Horizontally"],
    difficulty: "Medium",
    prompt: "To scale agents horizontally:",
    options: [
      { key: "A", text: "Reduce model size" },
      { key: "B", text: "Add more vector stores" },
      { key: "C", text: "Stateless design with caching" },
      { key: "D", text: "Increase top-p" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

To scale horizontally across many servers, agents should be stateless: any instance can handle any request because no long-term state is stored locally. Shared caches (for embeddings, retrieval results) then improve performance without breaking this statelessness.
A. Reduce model size helps cost but is not the core scaling pattern.
B. Add more vector stores can help capacity but not necessarily orchestration.
D. Increase top-p
is unrelated to scalability.`,
    underlyingPrinciple: "Horizontal Scalability Design - Architecting agents so each request is self-contained, enabling easy distribution across multiple workers with shared, externalized state and caching.",
    improvedPromptExample: `“Describe how to redesign our current stateful agent into a stateless service that reads context from a shared store and uses embedding/retrieval caches so we can run many parallel instances behind a load balancer.”`,
  },
  {
    id: 93,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Basis of Anti-Hallucination Guardrails"],
    difficulty: "Medium",
    prompt: "Anti-hallucination guardrails rely on:",
    options: [
      { key: "A", text: "Constraint density" },
      { key: "B", text: "Random sampling" },
      { key: "C", text: "Token drift suppression" },
      { key: "D", text: "Embedding normalization" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

Guardrails work by narrowing the model’s degrees of freedom with dense, specific constraints: allowed domains, required citations, refusal rules, schemas, and safety checks. The more clearly and consistently these are applied, the less room the model has to hallucinate.
B. Random sampling
increases unpredictability.
C. Token drift suppression is not a standard concept.
D. Embedding normalization affects vector math, not hallucination directly.`,
    underlyingPrinciple: "Behavior-Shaping Through Structural Constraint - Reducing unsafe or ungrounded behavior by specifying detailed rules, formats, and boundaries the model must follow.",
    improvedPromptExample: `“You must follow these constraints: (1) answer only about our internal policy docs, (2) cite at least one document and line for each factual claim, (3) say ‘I don’t know’ if the docs don’t support an answer. Do not deviate from these rules.”`,
  },
  {
    id: 94,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Combining Multiple Retrieval Sources"],
    difficulty: "Medium",
    prompt: "When combining multiple retrieval sources:",
    options: [
      { key: "A", text: "Mix blindly" },
      { key: "B", text: "Use weighted fusion" },
      { key: "C", text: "Increase top-k" },
      { key: "D", text: "Remove reranking" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

When you have several retrieval sources (e.g., vector index, keyword search, metadata filters), weighted fusion lets you combine scores into a unified relevance ranking. You can weight some signals more heavily (e.g., semantic similarity 70%, keyword match 30%).
A. Mix blindly ignores quality differences.
C. Increase top-k returns more results but may add noise.
D. Remove reranking usually reduces quality.`,
    underlyingPrinciple: "Evidence Fusion for Retrieval Reliability - Combining multiple relevance signals into a single score to improve overall retrieval quality.",
    improvedPromptExample: `“Describe how to build a fusion layer that combines vector similarity, keyword score, and recency, with configurable weights, to rank documents for an enterprise RAG system.”`,
  },
  {
    id: 95,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Best Practice for Production Monitoring"],
    difficulty: "Medium",
    prompt: "Best practice for production monitoring:",
    options: [
      { key: "A", text: "Human spot checks" },
      { key: "B", text: "Automatic metric dashboards + anomaly detection" },
      { key: "C", text: "Manual logs" },
      { key: "D", text: "Periodic restarts" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Reliable production systems have automated monitoring: dashboards for latency, error rates, grounding rate, rejection rate, etc., plus anomaly detection to alert teams when metrics deviate from normal ranges. Manual spot checks alone are too slow.
A. Human spot checks are useful but insufficient.
C. Manual logs are hard to analyze at scale.
D. Periodic restarts may hide issues rather than diagnose them.`,
    underlyingPrinciple: "Operational AI Observability — Continuously tracking key metrics and detecting anomalies so issues in agentic/RAG systems are caught early.",
    improvedPromptExample: `“List the top 10 metrics we should monitor for our RAG-based support assistant (e.g., latency, tool error rate, hallucination complaints). For each, propose an alert threshold and how we should respond if it is exceeded.”`,
  },
  {
    id: 96,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Source of Stale-Cache Errors"],
    difficulty: "Medium",
    prompt: "Stale-cache errors come from:",
    options: [
      { key: "A", text: "Temperature" },
      { key: "B", text: "Outdated cached retrieval results" },
      { key: "C", text: "Token limit" },
      { key: "D", text: "JSON formatting" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Stale-cache errors occur when cached retrieval results or embeddings no longer match the current underlying data (e.g., updated policies, changed files). The system serves old context while users expect fresh information.
A. Temperature doesn’t control cache freshness.
C. Token limit can truncate context but doesn’t create stale data.
D. JSON formatting is unrelated.`,
    underlyingPrinciple: "Cache Validity Management - Ensuring cached retrieval and embeddings are refreshed or invalidated when source data changes to avoid serving outdated information.",
    improvedPromptExample: `“Design a cache invalidation strategy where any change to a source document automatically invalidates related cached retrieval results and embeddings, ensuring RAG answers always use the latest version.”`,
  },
  {
    id: 97,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Effect of Inference Batching"],
    difficulty: "Medium",
    prompt: "Inference batching improves:",
    options: [
      { key: "A", text: "Hallucination" },
      { key: "B", text: "Throughput" },
      { key: "C", text: "Reasoning" },
      { key: "D", text: "Summary quality" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Inference batching sends multiple requests through the model in parallel on the GPU, improving throughput (requests per second) and often reducing average cost per request. It does not inherently improve reasoning quality or hallucination behavior.
A. Hallucination is not directly affected.
C. Reasoning quality is mostly unchanged.
D. Summary quality is unaffected by batching alone.`,
    underlyingPrinciple: "GPU Batch Optimization - Leveraging hardware parallelism by processing multiple inputs together to maximize utilization and throughput.",
    improvedPromptExample: `“Explain to our infrastructure team how batching 16 queries at a time through the model can increase throughput and reduce cost per query and identify any latency trade-offs for individual requests.”`,
  },
  {
    id: 98,
    chapterId: "ch3",
    sectionTags: ["Ch3 – RAG Relevance Testing"],
    difficulty: "Medium",
    prompt: "RAG relevance testing uses:",
    options: [
      { key: "A", text: "BLEU" },
      { key: "B", text: "Cross-encoder rerankers" },
      { key: "C", text: "Token variance" },
      { key: "D", text: "Chunk pruning" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A cross-encoder jointly encodes the query and each candidate chunk to produce a more accurate relevance score than simple vector similarity. Using it as a reranker on top of bi-encoder retrieval is a common best practice for measuring and improving relevance.
A. BLEU compares n-grams, not retrieval relevance.
C. Token variance is not a retrieval metric.
D. Chunk pruning is a design choice, not a relevance test.`,
    underlyingPrinciple: "Two-Stage Retrieval (Bi-Encoder → Cross-Encoder) First retrieve candidates quickly with embeddings, then rerank a smaller set with a more expensive but precise model.",
    improvedPromptExample: `“Describe how to evaluate a RAG system by first retrieving the top 50 chunks using a bi-encoder, then reranking those with a cross-encoder, and measuring whether relevant chunks move to the top positions.”`,
  },
  {
    id: 99,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Last Agent in Enterprise Pipelines"],
    difficulty: "Medium",
    prompt: "Which agent acts last in most enterprise systems?",
    options: [
      { key: "A", text: "Researcher agent" },
      { key: "B", text: "Reasoner agent" },
      { key: "C", text: "Verifier agent" },
      { key: "D", text: "Stylist agent" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

In many enterprise workflows, the Verifier agent runs last to check factual grounding, policy compliance, tone, and formatting before output goes to the end user. It acts as a final gate.
A. Researcher agent typically runs earlier to gather information.
B. Reasoner agent synthesizes and explains.
D. Stylist agent may adjust tone but should still be subject to verification afterward in high-risk domains.`,
    underlyingPrinciple: "Final Verification Layer Ending the chain with an agent focused on correctness and compliance to minimize risk before deployment to users.",
    improvedPromptExample: `“You are the final Verifier Agent in this pipeline. Approve an answer only if it is grounded, policy-compliant, and clearly written. If it fails any check, provide a corrected version and a brief explanation of what you changed.”`,
  },
  {
    id: 100,
    chapterId: "ch3",
    sectionTags: ["Ch3 – Root Cause of “Context Forgetting”"],
    difficulty: "Medium",
    prompt: "Root cause of “context forgetting” in agents:",
    options: [
      { key: "A", text: "Too many tools" },
      { key: "B", text: "Shallow memory replay" },
      { key: "C", text: "CoT interference" },
      { key: "D", text: "High temperature" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

“Context forgetting” often arises when memory replay (summaries or state passed between steps) is too shallow—for example, a one-line recap that omits important constraints, decisions, or user preferences. The agent appears to forget past context because critical information was never preserved in the replay.
A. Too many tools adds complexity but isn’t the direct cause.
C. CoT interference can complicate reasoning, but context loss is mainly about memory.
D. High temperature increases variability, not structural forgetting.`,
    underlyingPrinciple: "State Persistence Engineering - Designing replay summaries and memory mechanisms that capture and preserve essential context, so agents remain aware of prior constraints and decisions.",
    improvedPromptExample: `“Before proceeding to the next task, write a detailed ‘context summary’ (max 150 tokens) that captures the user’s goal, key constraints, and decisions made so far. Use this summary, not the full history, as your context for all future steps.”`,
  },

  // ---------------------------------------------------------------------------
  // Chapter 4 – QUESTIONS (101–120) – populated from Questions chp4.docx
  // ---------------------------------------------------------------------------
  {
    id: 101,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Over trust as a Workplace Risk"],
    difficulty: "Medium",
    prompt: "Which is a core issue in LLM workplace deployment?",
    options: [
      { key: "A", text: "Too much creativity" },
      { key: "B", text: "Over trust by employees" },
      { key: "C", text: "Token cost" },
      { key: "D", text: "Output length" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

A core issue when deploying LLMs in the workplace is that employees often treat AI outputs as if they were authoritative, especially when the responses are fluent, confident, and well-formatted. This “automation bias” can lead people to skip verification steps, rely on ungrounded answers, and make business or legal decisions based on unchecked information.
A. creativity
C. token cost
D. output length
All three matter operationally, they do not rise to the same level of systemic risk as employees over-trusting the system and failing to apply human judgment and due diligence.`,
    underlyingPrinciple: "Human–AI Trust Calibration - Designing AI systems and user training so that people understand what the model is good at, where it can fail, and when verification or escalation to a human expert is required.",
    improvedPromptExample: `“You are assisting a knowledge worker. For each answer you provide, explicitly list: (1) which parts are well supported by the provided sources, (2) which parts are uncertain or assumption-based, and (3) a recommended level of human review (e.g., ‘light check,’ ‘expert review required’).”`,
  },
  {
    id: 102,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Focus of AI Governance Frameworks"],
    difficulty: "Medium",
    prompt: "AI governance frameworks focus on:",
    options: [
      { key: "A", text: "Output style" },
      { key: "B", text: "Risk, accountability, transparency" },
      { key: "C", text: "Creativity" },
      { key: "D", text: "Latency" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

AI governance frameworks are not primarily about style, brand voice, or creativity. They exist to manage risk, clarify accountability, and provide transparency over how AI systems are designed, used, monitored, and audited. This includes questions like: Who is responsible if the model fails? What risks were identified and mitigated? How can regulators, auditors, or customers understand how decisions were made?
A. Output style
C. creativity
D. latency
All 3 are implementation concerns, but governance frameworks are fundamentally about responsible, accountable, and transparent use of AI.`,
    underlyingPrinciple: "Responsible AI Protocols - Policies, processes, and controls that define how AI is developed, deployed, monitored, and audited so that risks are identified, mitigated, and traceable to accountable owners.",
    improvedPromptExample: `“You are an AI governance advisor for our company. Given this proposed AI use case, identify: (1) key risks, (2) accountability assignments (who is responsible for what), and (3) the transparency mechanisms we should implement (e.g., logs, documentation, disclosures) to satisfy internal policy and external regulators.”`,
  },
  {
    id: 103,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Ethical Risk in RAG"],
    difficulty: "Medium",
    prompt: "Which is an ethical risk in RAG?",
    options: [
      { key: "A", text: "Too many citations" },
      { key: "B", text: "Leakage of private documents through retrieval" },
      { key: "C", text: "Lower latency" },
      { key: "D", text: "Structure enforcement" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

In a Retrieval-Augmented Generation system, documents are embedded and stored in an index. If that index contains confidential or privileged material—and access controls are weak—the system can “leak” these documents by retrieving them for users who should not see them. This is an ethical and legal risk because sensitive information (e.g., HR files, legal memos, trade secrets) may be surfaced unintentionally.
Too many citations is not inherently unethical;
Lower latency is a performance improvement;
Structure enforcement improves consistency but is not an ethical risk.`,
    underlyingPrinciple: "Retrieval-Level Privacy Risk - The danger that confidential or sensitive content can be exposed through retrieval if access control, data segregation, or index design are not properly enforced.",
    improvedPromptExample: `“You are a RAG assistant with strict privacy rules. When retrieving content, only consider documents explicitly tagged as ‘public’ or ‘shared-with-[user_role]’. If a query appears to request information outside the user’s permission scope, refuse the request and explain that the content is restricted.”`,
  },
  {
    id: 104,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Determinism in High Stakes Domains"],
    difficulty: "Medium",
    prompt: "High-stakes domains require:",
    options: [
      { key: "A", text: "Chain-of-thought removal" },
      { key: "B", text: "Deterministic outputs" },
      { key: "C", text: "Personality prompting" },
      { key: "D", text: "Temperature 1.2" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

In high-stakes domains such as medicine, law, finance, or safety-critical engineering, organizations need the same input to produce the same output every time. Deterministic decoding (e.g., temperature near 0, conservative sampling) minimizes random variation and makes the system easier to test, validate, and audit.
A. Chain-of-thought removal  might or might not be appropriate depending on the domain.
C. Personality prompting  is irrelevant to safety.
D. A high temperature such as 1.2  increases randomness and is inappropriate when decisions affect health`,
    underlyingPrinciple: "Repeatability in High-Risk AI - Configuring and validating AI systems so that their behavior is stable and predictable, enabling reliable testing, oversight, and compliance in safety-critical contexts.",
    improvedPromptExample: `“For this medical-risk classification task, use deterministic settings (temperature = 0, top-p ≤ 0.1). Given the same patient input, always return the same classification and rationale, and clearly mark any aspects that should be confirmed by a human clinician.”`,
  },
  {
    id: 105,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Grounding Legal AI Outputs"],
    difficulty: "Medium",
    prompt: "When deploying AI in legal workflows, one must:",
    options: [
      { key: "A", text: "Use open-ended answers" },
      { key: "B", text: "Use grounded references" },
      { key: "C", text: "Increase temperature" },
      { key: "D", text: "Add jokes" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

In legal workflows, an AI system must not invent statutes, cases, or clauses. Outputs need to be tightly grounded in real legal sources such as statutes, regulations, case law, and internal policy documents.
A. Open-ended answers  invite speculation.
C. Increasing temperature  further encourages creative but potentially incorrect content.
D. Adding jokes  is inappropriate for most legal contexts and can undermine professional credibility.`,
    underlyingPrinciple: "Grounded Legal Reasoning - Constraining AI outputs so that they are explicitly tied to authoritative legal texts, enabling lawyers to trace each conclusion back to recognizable sources.",
    improvedPromptExample: `“You are assisting on a legal research task. Answer only using the provided statutes and cases. For each conclusion, (1) quote or paraphrase the relevant passage, (2) provide a citation to the statute or case (e.g., ‘Statute §5.3’ or ‘Case X v. Y, 2019’), and (3) avoid speculation beyond the provided sources.”`,
  },
  {
    id: 106,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Human-in-the-Loop in Medical Decisions"],
    difficulty: "Medium",
    prompt: "The “human-in-the-loop” is most critical when:",
    options: [
      { key: "A", text: "Summaries" },
      { key: "B", text: "Internal emails" },
      { key: "C", text: "Medical decisions" },
      { key: "D", text: "Creative writing" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

Human-in-the-loop oversight is most critical when AI advice can directly influence health outcomes. In medical contexts, clinicians are ultimately responsible for diagnosis and treatment. AI can assist with summarization, pattern recognition, or literature review, but the final decision must remain with a qualified human professional.
A. Summaries are lower-risk tasks.
B. Emails are lower-risk tasks.
D. Creative writing does not typically affect safety.`,
    underlyingPrinciple: "Human Oversight in Safety-Critical Workflows - Ensuring that qualified professionals review and own decisions when AI outputs affect health, safety, legal status, or substantial financial consequences.",
    improvedPromptExample: `“You are an AI assistant to a medical doctor. Provide differential diagnoses and possible treatment options based strictly on the patient summary and the attached guidelines. Clearly label all outputs as ‘assistant suggestions only’ and include a statement that the final decision must be made by a licensed clinician.”`,
  },
  {
    id: 107,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Emergent Risk: Agent Collusion"],
    difficulty: "Medium",
    prompt: "Which is a form of emergent risk?",
    options: [
      { key: "A", text: "Output formatting" },
      { key: "B", text: "Agent collusion" },
      { key: "C", text: "JSON errors" },
      { key: "D", text: "Vocabulary drift" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Emergent risks are behaviors that were not explicitly programmed but arise from interactions between components. In multi-agent systems, agents can inadvertently “collude,” reinforcing one another’s mistakes or bypassing safety constraints through back-and-forth reasoning. For example, one agent might suggest a risky action and another agent might validate it without proper checks, creating a feedback loop.
A. Output formatting
C. JSON errors
D. vocabulary drift
All three are engineering or usability issues.`,
    underlyingPrinciple: "Multi-Agent Emergent Behavior - Unintended system level behaviors that arise when multiple AI agents interact, sometimes amplifying risk or circumventing guardrails in ways not apparent when agents are tested in isolation.",
    improvedPromptExample: `“You are one of several cooperating agents. You may not override or weaken safety policies defined in the system message. If another agent proposes an action that appears to violate policy or safety rules, you must explicitly flag it as unsafe and halt the workflow instead of approving it.”`,
  },
  {
    id: 108,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Bias Mitigation Techniques"],
    difficulty: "Medium",
    prompt: "Bias mitigation requires:",
    options: [
      { key: "A", text: "Higher temperature" },
      { key: "B", text: "Counterfactual examples and evaluation" },
      { key: "C", text: "RAG" },
      { key: "D", text: "Persona prompts" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Bias mitigation starts with detecting where the model behaves differently across groups and scenarios. Counterfactual examples—where you change sensitive attributes (e.g., gender, ethnicity, age) while holding everything else constant—reveal unfair differences in outputs. Evaluating performance on these counterfactuals helps teams adjust data, prompts, or alignment techniques to reduce bias.
A. Higher temperature  simply adds randomness.
C. RAG  improves grounding but does not
D. Persona prompts  affect style and perspective but are not a disciplined bias-mitigation technique.`,
    underlyingPrinciple: "Bias Discovery & Mitigation Through Counterfactuals - Systematically probing model behavior with controlled variations in sensitive attributes to identify and reduce unfair or harmful patterns.",
    improvedPromptExample: `“Given this loan-approval scenario, generate two analyses: one using the original applicant attributes and one with a counterfactual version where only sensitive attributes (e.g., gender, race) are changed. Compare the outputs and explicitly highlight any differences in recommendations, then explain whether those differences are justified or indicative of bias.”`,
  },
  {
    id: 109,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Reducing Excessive Model Refusals"],
    difficulty: "Medium",
    prompt: "Model refusal (excessive safety) can be reduced by:",
    options: [
      { key: "A", text: "Jailbreaking" },
      { key: "B", text: "Policy-aligned rephrasing" },
      { key: "C", text: "Increasing temperature" },
      { key: "D", text: "Zero-shot prompts" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Sometimes models refuse safe, legitimate tasks because the request resembles a restricted category.
A. The appropriate remedy is not to “jailbreak”
C. Increasing temperature  will not solve policy-driven refusals and may worsen output stability.
D. Zero-shot prompting  does not inherently reduce refusals and may remove useful context.`,
    underlyingPrinciple: "Refinement Instead of Bypass - Adjusting and clarifying user requests to fit within safety policies, rather than trying to circumvent the model’s alignment and safeguards.",
    improvedPromptExample: `“The model refused this request as unsafe. Rewrite the request so that it is clearly focused on high-level education and safety, and not on instructions to cause harm. Then explain why the revised request is policy-compliant while still meeting the user’s legitimate needs.”`,
  },
  {
    id: 110,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Business Value of Prompt Engineering"],
    difficulty: "Medium",
    prompt: "Business value of prompt engineering is demonstrated by:",
    options: [
      { key: "A", text: "Lower temperature" },
      { key: "B", text: "Tangible efficiency or accuracy improvements" },
      { key: "C", text: "Longer outputs" },
      { key: "D", text: "More creativity" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Prompt engineering has business value when it measurably improves outcomes such as reduced handling time, fewer errors, higher customer satisfaction, or better compliance. Executives care about ROI, not parameters in isolation.
A. Lower temperature
C. longer outputs
D. more creativity
are only meaningful if they translate into measurable improvements.`,
    underlyingPrinciple: "Outcome-Based Prompt Optimization - Evaluating and iterating prompts based on metrics that matter to the organization, such as cost, speed, quality, and risk reduction.",
    improvedPromptExample: `“Redesign this customer-support prompt to reduce average handling time by at least 20% while maintaining or improving accuracy. After proposing the new prompt, describe how you would A/B test it against the current version and which KPIs you would track to demonstrate business value.”`,
  },
  {
    id: 111,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Confident Wrong Answers"],
    difficulty: "Medium",
    prompt: "A model confidently giving wrong answers is:",
    options: [
      { key: "A", text: "Drift" },
      { key: "B", text: "Hallucination" },
      { key: "C", text: "Overfitting" },
      { key: "D", text: "Latency error" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

When a model provides a detailed, fluent, and confident answer that is factually wrong, this is hallucination. The model is not “lying”; it is completing patterns based on probability, not verifying facts.
A. Drift  refers to gradual change in behavior or meaning over time.
C. Overfitting  is a training phenomenon where a model memorizes training data but fails to generalize.
D. Latency error  is a performance issue`,
    underlyingPrinciple: "Hallucination - The tendency of LLMs to generate fluent but factually incorrect or ungrounded information because they optimize for plausible text continuation rather than truth verification.",
    improvedPromptExample: `“When answering this question, (1) first list the facts you are certain about, (2) list any parts you are uncertain about, and (3) clearly label any speculative statements as ‘speculation’. If you cannot provide a confident factual answer, say ‘I don’t know’ and recommend what the user should check next.”`,
  },
  {
    id: 112,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Role of Expectation Management"],
    difficulty: "Medium",
    prompt: "Expectation management with users prevents:",
    options: [
      { key: "A", text: "Tool failures" },
      { key: "B", text: "Overreliance on unverified outputs" },
      { key: "C", text: "Embedding errors" },
      { key: "D", text: "Latency" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Expectation management is about educating users on what AI can and cannot do. If users understand limitations, they are less likely to blindly trust AI outputs for high-risk decisions. This directly reduces overreliance on unverified answers.
A. It does not prevent tool failures
C. embedding errors
D. latency issues
It does not prevent these tool failures which are technical concerns.`,
    underlyingPrinciple: "User Trust Calibration - Communicating capabilities, limitations, and proper usage patterns so users know when to trust AI, when to verify, and when to escalate to a human.",
    improvedPromptExample: `“You are an AI assistant that must manage expectations. At the end of each answer, add a short ‘Confidence & Verification’ note that explains how confident you are, what was assumed, and what the user should verify with a human or primary source before acting.”`,
  },
  {
    id: 113,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Minimizing Legal Exposure"],
    difficulty: "Medium",
    prompt: "Which minimizes legal exposure?",
    options: [
      { key: "A", text: "Retrieval only" },
      { key: "B", text: "Documented audit trails" },
      { key: "C", text: "Zero-shot" },
      { key: "D", text: "Temperature tuning" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

To minimize legal exposure, organizations need to reconstruct how a particular AI-involved decision was made: what prompt was used, what model produced the answer, what data was consulted, and what human approvals were captured. Documented audit trails provide this traceability.
A. Retrieval only  improves grounding but does not
C. Zero-shot prompting and
D. Temperature tuning  are technical choices`,
    underlyingPrinciple: "AI Accountability & Auditability - Maintaining records of prompts, inputs, outputs, model versions, and human decisions so that organizations can demonstrate due care, investigate incidents, and respond to regulators or courts.",
    improvedPromptExample: `“For each AI-assisted decision, generate a short ‘Decision Log’ entry that records: (1) the user’s request, (2) the model’s answer, (3) the sources or retrieval IDs used, and (4) any human approvals. Format it in a way that can be stored and searched as part of an audit trail.”`,
  },
  {
    id: 114,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Task Substitution Risk"],
    difficulty: "Medium",
    prompt: "\"Task substitution risk\" means:",
    options: [
      { key: "A", text: "AI replaces parts of a workflow" },
      { key: "B", text: "Output shortness" },
      { key: "C", text: "Retrieval mismatch" },
      { key: "D", text: "Tool failure" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

“Task substitution risk” refers to the way AI can replace specific tasks within a job or process (e.g., drafting a first version, summarizing documents). This can change job roles, skill requirements, and staffing levels. Understanding task substitution is important for workforce planning and ethical deployment.
B. It is not about output shortness,
C. retrieval mismatch or
D. tool failure.`,
    underlyingPrinciple: "Task-Level Automation Dynamics - The way AI systems alter workflows by taking over some tasks, changing how human workers contribute, and potentially creating or eliminating roles.",
    improvedPromptExample: `“Analyze this end-to-end business process and identify which subtasks could be safely automated by an LLM (e.g., summarization, drafting, classification) and which subtasks must remain human-owned due to judgment, ethics, or regulatory requirements. Present your analysis in a way that HR and operations can use for workforce planning.”`,
  },
  {
    id: 115,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Non-Alignment Technique"],
    difficulty: "Medium",
    prompt: "Which is not an alignment technique?",
    options: [
      { key: "A", text: "RLHF" },
      { key: "B", text: "Supervised fine-tuning" },
      { key: "C", text: "Embedding retrieval" },
      { key: "D", text: "Constitutional prompting" },
    ],
    correctOptionKey: "C",
    explanation: `Explanation:

Alignment techniques directly shape model behavior during or after training:
Embedding retrieval (Option C) does not change the model’s internal preferences; it simply provides better external context. It is a grounding and retrieval technique, not an alignment method.
Reinforcement Learning from Human Feedback (RLHF), supervised fine-tuning, and constitutional prompting (Option A, B, and D) are all alignment approaches.`,
    underlyingPrinciple: "Distinguishing Training Alignment from Grounding - Understanding that alignment methods modify the model’s behavior through training or post-training objectives, whereas retrieval techniques supply external information without changing the underlying model.",
    improvedPromptExample: `“Explain to a non-technical executive the difference between (1) aligning a model via RLHF or constitutional prompting and (2) grounding a model with retrieval, using practical examples of how each approach affects behavior and risk.”`,
  },
  {
    id: 116,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Logging for Enterprise Agents"],
    difficulty: "Medium",
    prompt: "When deploying enterprise agents, you must:",
    options: [
      { key: "A", text: "Disable logs" },
      { key: "B", text: "Log everything with PII removed" },
      { key: "C", text: "Increase temperature" },
      { key: "D", text: "Randomize prompt order" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Enterprises need logs for debugging, monitoring, security investigations, and compliance. However, logs cannot become a new source of privacy violations. The best practice is to log as much relevant detail as possible while stripping or anonymizing personally identifiable information (PII).
Disabling logs (A) removes observability and is risky.
Increasing temperature (C) and randomizing prompt order (D) are unrelated to logging.`,
    underlyingPrinciple: "Privacy-Preserving Observability - Capturing rich telemetry about AI system behavior while protecting user privacy through redaction, anonymization, and strict access control.",
    improvedPromptExample: `“Generate a log entry for this interaction that includes: (1) a hashed user ID, (2) a redacted prompt where PII is masked, (3) the model’s answer ID and version, and (4) any tools called. Do not store raw PII or full free-text content that could identify individuals.”`,
  },
  {
    id: 117,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Reducing Liability with Citations"],
    difficulty: "Medium",
    prompt: "To reduce liability, enterprises need:",
    options: [
      { key: "A", text: "Verifiable citations" },
      { key: "B", text: "High temperature" },
      { key: "C", text: "Zero-shot" },
      { key: "D", text: "Persona prompts" },
    ],
    correctOptionKey: "A",
    explanation: `Explanation:

Verifiable citations tie AI outputs to specific documents, lines, or data sources. This allows organizations to justify decisions by showing that they relied on recognized evidence, not on ungrounded AI speculation.
High temperature (B) increases risk, not reduces it.
Zero-shot prompting (C) and persona prompts (D) have no direct effect on legal liability.`,
    underlyingPrinciple: "Traceable AI Decision-Making - Ensuring that important outputs can be traced back to concrete evidence or authoritative sources, enabling review, challenge, and justification of AI-influenced decisions.",
    improvedPromptExample: `“When answering this regulatory question, provide inline citations in the format ‘[Source: Policy-Doc-ID, Section X.Y]’ for every factual claim. If no supporting citation exists in the provided corpus, clearly state that the answer is not fully supported and should be treated as a hypothesis, not a decision basis.”`,
  },
  {
    id: 118,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Socio-Technical Risk"],
    difficulty: "Medium",
    prompt: "Which is an example of socio-technical risk?",
    options: [
      { key: "A", text: "Model latency" },
      { key: "B", text: "Employees blindly trusting outputs" },
      { key: "C", text: "Too many embeddings" },
      { key: "D", text: "Chunk-size errors" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Socio-technical risks come from the interaction between people and technology. Employees blindly trusting AI outputs—even when the system warns about uncertainty—is a classic socio-technical risk. It can lead to systematic errors, poor decisions, or compliance violations.
Model latency (A), too many embeddings (C), and chunk-size errors (D) are technical or performance issues, not socio-technical in nature.`,
    underlyingPrinciple: "Human Factors in AI Deployment - The ways in which user behavior, organizational culture, and interface design shape the real-world impact of AI systems, often creating risks beyond purely technical failures.",
    improvedPromptExample: `“You are an AI assistant working with non-technical staff. At the end of each answer, include a short ‘Human Checks Needed’ section that specifies what the user should verify or discuss with a colleague before acting on your recommendations.”`,
  },
  {
    id: 119,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Root Cause of AI Misuse"],
    difficulty: "Medium",
    prompt: "AI misuse often stems from:",
    options: [
      { key: "A", text: "Low top-p" },
      { key: "B", text: "Poor governance + unclear boundaries" },
      { key: "C", text: "JSON failures" },
      { key: "D", text: "Bad embeddings" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

AI misuse often arises not from the model’s internals but from weak governance: vague policies, unclear allowed use cases, and no enforcement of boundaries around who can do what with the system.
Low top-p (A), JSON failures (C), and bad embeddings (D) all affect system behavior, but they are technical details. Without clear governance, even a technically sound system can be misused for tasks it was never intended to perform.`,
    underlyingPrinciple: "Governance-Driven Risk Mitigation - Establishing clear policies, allowed use cases, and enforcement mechanisms to ensure AI is used only in appropriate, well-defined ways.",
    improvedPromptExample: `“You are a policy-aware assistant. Before answering, classify the user’s request into one of three categories: Allowed, Restricted (needs human approval), or Prohibited. Explain your classification briefly and respond only if the request is Allowed or has been hypothetically approved by a human.”`,
  },
  {
    id: 120,
    chapterId: "ch4",
    sectionTags: ["Ch4 – Monitoring Prompt Changes"],
    difficulty: "Medium",
    prompt: "Why must enterprises monitor prompt changes?",
    options: [
      { key: "A", text: "Creativity" },
      { key: "B", text: "Changes can alter legal, factual, or risk profiles" },
      { key: "C", text: "Output length" },
      { key: "D", text: "Temperature" },
    ],
    correctOptionKey: "B",
    explanation: `Explanation:

Prompts are not just “wording”; they encode instructions, constraints, and behavior. Even small modifications can change how a model handles sensitive topics, what it refuses, how it cites sources, and how often it hallucinates. Therefore, enterprises must treat prompt changes like code changes: they can alter legal exposure, factual reliability, and safety.
Creativity (Option A), output length (Option C), and temperature (Option D) may be influenced by prompt wording, but the key reason for monitoring is the resulting change in risk profile.`,
    underlyingPrinciple: "Prompt Stability & Change Control - Managing prompts as versioned, testable artifacts whose changes must be reviewed and validated because they can materially impact safety, compliance, and factual behavior.",
    improvedPromptExample: `“You are part of a prompt-review workflow. Given two versions of a production prompt (old and new), analyze and summarize: (1) changes that might affect factual accuracy, (2) changes that might alter safety or legal risk, and (3) recommended test cases to run before approving the new prompt for deployment.”`,
  }

];
