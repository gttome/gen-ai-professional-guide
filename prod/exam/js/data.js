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
  // Chapter 2 – TEST QUESTIONS ONLY (placeholder content)
  // ---------------------------------------------------------------------------
  {
    id: "ch2-TEST-2.1-001",
    chapterId: "ch2",
    sectionTags: ["TEST – Ch2 2.1 Prompt Design Basics"],
    difficulty: "Easy",
    prompt:
      "[TEST] In Chapter 2, what is the main goal of using a structured prompt framework?",
    options: [
      {
        key: "A",
        text: "To completely automate all human decision-making."
      },
      {
        key: "B",
        text: "To make prompts more repeatable and easier for non-engineers."
      },
      { key: "C", text: "To reduce the size of the model." },
      {
        key: "D",
        text: "To protect the model from seeing sensitive data."
      }
    ],
    correctOptionKey: "B",
    explanation: `
[TEST QUESTION – CHAPTER 2]

A structured prompt framework makes it easier for non-engineers to reuse, adapt, and debug prompts without having to understand the internals of the model.
    `.trim()
  },

  {
    id: "ch2-TEST-2.2-001",
    chapterId: "ch2",
    sectionTags: ["TEST – Ch2 2.2 Prompt Patterns"],
    difficulty: "Medium",
    prompt:
      "[TEST] Which of the following best describes a 'Chain-of-Thought' prompt pattern in Chapter 2?",
    options: [
      {
        key: "A",
        text: "A pattern that asks the model to answer in one word."
      },
      {
        key: "B",
        text: "A pattern that walks the model through intermediate reasoning steps."
      },
      { key: "C", text: "A pattern that hides all reasoning from the user." },
      {
        key: "D",
        text: "A pattern that forces the model to quote its training data."
      }
    ],
    correctOptionKey: "B",
    explanation: `
[TEST QUESTION – CHAPTER 2]

Chain-of-Thought prompting encourages the model to show intermediate reasoning steps, which often improves accuracy and transparency.
    `.trim()
  },

  // ---------------------------------------------------------------------------
  // Chapter 3 – TEST QUESTIONS ONLY (placeholder content)
  // ---------------------------------------------------------------------------
  {
    id: "ch3-TEST-3.1-001",
    chapterId: "ch3",
    sectionTags: ["TEST – Ch3 3.1 Evaluation Basics"],
    difficulty: "Medium",
    prompt:
      "[TEST] In Chapter 3, what does it mean to 'evaluate prompts like experiments'?",
    options: [
      {
        key: "A",
        text: "Change all variables at once until output looks good."
      },
      {
        key: "B",
        text: "Run small, controlled changes and compare results objectively."
      },
      {
        key: "C",
        text: "Ask different models and average their responses."
      },
      {
        key: "D",
        text: "Only rely on your intuition without any metrics."
      }
    ],
    correctOptionKey: "B",
    explanation: `
[TEST QUESTION – CHAPTER 3]

Evaluating prompts like experiments means changing one or two variables at a time and using clear criteria to decide which version works better.
    `.trim()
  },

  {
    id: "ch3-TEST-3.2-001",
    chapterId: "ch3",
    sectionTags: ["TEST – Ch3 3.2 Metrics"],
    difficulty: "Easy",
    prompt:
      "[TEST] Which metric is most aligned with Chapter 3's focus on 'practical usefulness' of AI outputs?",
    options: [
      { key: "A", text: "Token count per response." },
      { key: "B", text: "Model latency in milliseconds." },
      {
        key: "C",
        text: "How much time the human saves compared to doing the task manually."
      },
      { key: "D", text: "Number of GPUs used in training." }
    ],
    correctOptionKey: "C",
    explanation: `
[TEST QUESTION – CHAPTER 3]

Practical usefulness is often best measured in terms of time saved, error reduction, or improved decision quality for the human, not just model-centric metrics.
    `.trim()
  },

  // ---------------------------------------------------------------------------
  // Chapter 4 – TEST QUESTIONS ONLY (placeholder content)
  // ---------------------------------------------------------------------------
  {
    id: "ch4-TEST-4.1-001",
    chapterId: "ch4",
    sectionTags: ["TEST – Ch4 4.1 Advanced Applications"],
    difficulty: "Medium",
    prompt:
      "[TEST] Chapter 4 introduces 'multi-step workflows'. What is the main benefit of chaining prompts into a workflow?",
    options: [
      {
        key: "A",
        text: "It guarantees zero hallucinations in every step."
      },
      {
        key: "B",
        text: "It lets you decompose complex tasks into smaller, more reliable steps."
      },
      {
        key: "C",
        text: "It removes the need for any human review."
      },
      {
        key: "D",
        text: "It allows the model to access its own training dataset."
      }
    ],
    correctOptionKey: "B",
    explanation: `
[TEST QUESTION – CHAPTER 4]

Chaining prompts into a workflow makes it easier to control quality at each step and to debug where errors are introduced.
    `.trim()
  },

  {
    id: "ch4-TEST-4.2-001",
    chapterId: "ch4",
    sectionTags: ["TEST – Ch4 4.2 Tooling & RAG"],
    difficulty: "Hard",
    prompt:
      "[TEST] When Chapter 4 discusses Retrieval-Augmented Generation (RAG), what is the main reason for adding retrieval?",
    options: [
      {
        key: "A",
        text: "To let the model modify its own weights during inference."
      },
      {
        key: "B",
        text: "To ground the model’s answers in up-to-date or domain-specific data."
      },
      {
        key: "C",
        text: "To reduce the number of tokens in the prompt to zero."
      },
      {
        key: "D",
        text: "To force the model to ignore the user’s instructions."
      }
    ],
    correctOptionKey: "B",
    explanation: `
[TEST QUESTION – CHAPTER 4]

RAG connects the model to external, curated information so answers are grounded in current or domain-specific sources instead of just the model's frozen training data.
    `.trim()
  }

];
