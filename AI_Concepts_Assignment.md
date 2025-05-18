# AI Concepts Assignment

## 1. & 2. Non-monotonic vs Probabilistic Reasoning

### Non-monotonic Reasoning
Non-monotonic reasoning allows conclusions to be retracted when new information becomes available. It uses default rules and assumptions that can be overridden.

**Example:**
- Default rule: "Birds typically fly"
- Initial knowledge: Tweety is a bird
- Initial conclusion: Tweety can fly
- New information: Tweety is a penguin
- Updated conclusion: Tweety cannot fly

**Diagram:**
```
Non-monotonic Reasoning Flow:
[Initial Knowledge] → [Default Rules] → [Tentative Conclusion]
        ↓
[New Information] → [Retract/Modify] → [Updated Conclusion]

Example: Bird Flying
[Bird] → [Default: Can Fly] → [Conclusion: Can Fly]
        ↓
[Penguin] → [Exception] → [New Conclusion: Cannot Fly]
```

### Probabilistic Reasoning
Probabilistic reasoning uses probability theory to quantify uncertainty and maintains degrees of belief rather than binary true/false conclusions.

**Example:**
- Initial evidence: Patient has fever
- Initial probability: P(Flu) = 0.6
- New evidence: Patient has cough
- Updated probability: P(Flu) = 0.8

**Diagram:**
```
Probabilistic Reasoning Flow:
[Initial Evidence] → [Probability Distribution] → [Initial Belief]
        ↓
[New Evidence] → [Bayesian Update] → [Updated Probability]

Example: Medical Diagnosis
[Fever] → [P(Flu)=0.6] → [Initial Diagnosis]
        ↓
[Cough] → [P(Flu)=0.8] → [Updated Diagnosis]
```

### Key Differences
- Non-monotonic reasoning allows conclusions to be withdrawn
- Probabilistic reasoning maintains degrees of belief
- Non-monotonic is more suitable for common-sense reasoning
- Probabilistic is better for statistical and uncertain data

## 3. Expert System Architecture

### Basic Components
1. Knowledge Base:
   - Stores domain-specific knowledge
   - Contains facts and rules
   - In MYCIN: medical knowledge about bacterial infections

2. Inference Engine:
   - Applies rules to facts
   - Uses forward/backward chaining
   - In MYCIN: determines likely infections

3. User Interface:
   - Allows interaction with the system
   - In MYCIN: doctor enters patient symptoms

4. Explanation Facility:
   - Explains reasoning process
   - In MYCIN: shows why certain diagnoses were made

**Diagram:**
```
┌─────────────────────────────────────────────────┐
│                  Expert System                  │
├─────────────────┬───────────────┬──────────────┤
│  Knowledge Base │ Inference     │  User        │
│                 │ Engine        │  Interface   │
├─────────────────┼───────────────┼──────────────┤
│ - Facts         │ - Rule        │ - Input      │
│ - Rules         │  Application  │  Collection  │
│ - Domain        │ - Forward/    │ - Results    │
│   Knowledge     │  Backward     │  Display     │
│                 │  Chaining     │              │
└─────────────────┴───────────────┴──────────────┘
        ↓                ↓               ↓
┌─────────────────────────────────────────────────┐
│              Explanation Facility               │
└─────────────────────────────────────────────────┘
```

### MYCIN's Design
- Used rule-based reasoning with certainty factors
- Example rule:
```
┌─────────────────────────────────────────────────┐
│ IF: Patient has fever AND high white blood count│
│ THEN: Likely bacterial infection (CF=0.7)       │
└─────────────────────────────────────────────────┘
```
- Combined multiple rules to reach conclusions
- Used backward chaining to diagnose infections

## 4. Hopfield Networks vs Adaptive Resonance Theory (ART)

### Hopfield Networks
- Recurrent neural network
- Content-addressable memory
- Learning: Hebbian learning rule
- Applications: Pattern recognition, optimization problems

**Diagram:**
```
Hopfield Network:
┌─────────────────────────────────────────────────┐
│                Input Layer                      │
│                    ↓                           │
│            Fully Connected Layer               │
│                    ↓                           │
│                Output Layer                    │
└─────────────────────────────────────────────────┘
(Recurrent connections between all neurons)

Learning Process:
[Input Pattern] → [Weight Update] → [Stable State]
      ↓              (Hebbian)          ↓
[Energy Minimization] ←────────── [Pattern Storage]
```

### Adaptive Resonance Theory (ART)
- Self-organizing neural network
- Learning: Competitive learning with vigilance parameter
- Applications: Clustering, classification
- Strengths: Can learn new patterns without forgetting old ones

**Diagram:**
```
ART Architecture:
┌─────────────────────────────────────────────────┐
│                Input Layer                      │
│                    ↓                           │
│            F1 Layer (Comparison)               │
│                    ↓                           │
│            F2 Layer (Recognition)              │
│                    ↓                           │
│            Reset Mechanism                     │
└─────────────────────────────────────────────────┘

Learning Process:
[Input] → [Vigilance Check] → [Pattern Match]
   ↓            ↓                    ↓
[New Category] ← [Reset] ← [Mismatch]
```

### Comparison

**Learning Mechanisms:**
- Hopfield: Hebbian, one-shot learning
- ART: Competitive, incremental learning

**Memory:**
- Hopfield: Fixed capacity
- ART: Can grow as needed

**Applications:**
- Hopfield: Best for:
  - Image restoration
  - Traveling salesman problem
  - Pattern recognition with known patterns
- ART: Good for:
  - Customer segmentation
  - Anomaly detection
  - Real-time classification
  - Data mining 

## 5. Knowledge Representation Structures

### Semantic Networks
Semantic networks represent knowledge as a graph of interconnected nodes and arcs, where:
- Nodes represent concepts or objects
- Arcs represent relationships between concepts
- Hierarchical organization with inheritance

**Example - Restaurant Visit:**
```
┌─────────────┐      is-a      ┌─────────────┐
│  Customer   │◄───────────────┤   Person    │
└──────┬──────┘                └─────────────┘
       │
       │ orders
       ▼
┌─────────────┐      has      ┌─────────────┐
│   Order     │◄──────────────┤   Menu      │
└──────┬──────┘               └─────────────┘
       │
       │ contains
       ▼
┌─────────────┐      is-a     ┌─────────────┐
│   Food      │◄──────────────┤   Item      │
└─────────────┘               └─────────────┘
```

### Frames
Frames are data structures that represent stereotypical situations with:
- Slots for attributes
- Default values
- Procedures (if-needed, if-added)
- Inheritance hierarchy

**Example - Restaurant Frame:**
```
┌─────────────────────────────────────────────┐
│                Restaurant Frame             │
├─────────────────────────────────────────────┤
│ Name: String                                │
│ Location: Address                           │
│ Cuisine: [Italian, Chinese, Indian, ...]    │
│ Price Range: [$, $$, $$$]                   │
│                                            │
│ Staff:                                      │
│   - Waiter: Person Frame                    │
│   - Chef: Person Frame                      │
│                                            │
│ Menu:                                       │
│   - Appetizers: [List of Items]             │
│   - Main Course: [List of Items]            │
│   - Desserts: [List of Items]               │
└─────────────────────────────────────────────┘
```

### Scripts
Scripts represent stereotypical sequences of events with:
- Entry conditions
- Scenes
- Roles
- Props
- Results

**Example - Restaurant Script:**
```
┌─────────────────────────────────────────────┐
│           Restaurant Visit Script           │
├─────────────────────────────────────────────┤
│ Entry Conditions:                           │
│ - Restaurant is open                        │
│ - Customer is hungry                        │
│                                            │
│ Scenes:                                     │
│ 1. Entering:                                │
│    - Customer enters                        │
│    - Host greets                           │
│    - Seating occurs                        │
│                                            │
│ 2. Ordering:                                │
│    - Waiter takes order                     │
│    - Kitchen prepares food                  │
│                                            │
│ 3. Eating:                                  │
│    - Food is served                         │
│    - Customer eats                          │
│                                            │
│ 4. Paying:                                  │
│    - Bill is presented                      │
│    - Payment is made                        │
│    - Customer leaves                        │
└─────────────────────────────────────────────┘
```

### Comparison of Representations

**Semantic Networks:**
- Strengths:
  - Natural representation of relationships
  - Easy to visualize
  - Good for inheritance
- Weaknesses:
  - Can become complex
  - Limited for procedural knowledge

**Frames:**
- Strengths:
  - Structured representation
  - Default values
  - Procedural attachments
- Weaknesses:
  - Rigid structure
  - May not capture dynamic aspects

**Scripts:**
- Strengths:
  - Temporal sequence
  - Causal relationships
  - Contextual information
- Weaknesses:
  - Limited to stereotypical situations
  - Less flexible for variations

### Use Case Comparison

For the restaurant scenario:
1. Semantic Network shows relationships between entities
2. Frame provides detailed attributes and structure
3. Script captures the sequence of events

Each representation serves different purposes:
- Semantic Networks: Understanding relationships
- Frames: Storing detailed information
- Scripts: Modeling processes and sequences 