/**
 * Struttura dati per i farmaci di emergenza pediatrica
 * Organizzati per sezione clinica
 */

export type DrugDosage = {
  label: string;
  dosePerKg?: number; // eg. 0.1 per 0.1 mL/kg
  dosePerKgMin?: number; // minimo per range (ad es. Adenosina 0.1)
  dosePerKgMax?: number; // massimo per range (ad es. Adenosina 0.2)
  doseFixed?: number; // per dosi fisse indipendenti da peso
  maxDose?: number; // massimale assoluto
  unit: string; // mL, mg, microgrammi, mmol, unità, J, etc.
  description: string;
  calculation?: string; // descrizione della formula di calcolo
  notes?: string; // note aggiuntive
};

export type DrugSubsection = {
  title: string;
  drugs: Drug[];
  additionalNotes?: string;
};

export type Drug = {
  name: string;
  dosages: DrugDosage[];
  additionalInfo?: string;
};

export type DrugCategory = {
  id: string;
  title: string;
  drugs?: Drug[]; // per categorie semplici senza sottosezioni
  subsections?: DrugSubsection[]; // per categorie con sottosezioni
  conclusion?: string; // testo conclusivo specifico della sezione
};

export const emergencyDrugsData: DrugCategory[] = [
  {
    id: "resuscitation",
    title: "Rianimazione – Arresto cardiaco",
    subsections: [
      {
        title: "Farmaci e trattamenti",
        drugs: [
          {
            name: "Adrenalina 1:10.000",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 0.1,
                unit: "mL",
                description: "Ripetere ogni 3–5 min.",
                calculation: "0.1 mL/kg × peso",
              },
            ],
          },
          {
            name: "Amiodarone, prima dose",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 5,
                maxDose: 150,
                unit: "mg",
                description: "Prima dose dopo il 3° shock. Dopo il 5° shock: 5 mg/kg (max 150 mg).",
                calculation: "5 mg/kg × peso (max 150 mg)",
              },
            ],
          },
          {
            name: "Bolo di fluidi",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 10,
                unit: "mL",
                description: "Cristalloidi bilanciati o soluzione fisiologica 0,9%; considerare fluidi riscaldati.",
                calculation: "10 mL/kg × peso",
              },
            ],
          },
          {
            name: "Defibrillazione iniziale",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 4,
                unit: "J",
                description: "Usare 4 J/kg per gli shock iniziali (max 120–200 J a seconda del tipo di defibrillatore).",
                calculation: "4 J/kg × peso",
              },
            ],
          },
          {
            name: "Defibrillazione refrattaria VF/pVT",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 8,
                maxDose: 360,
                unit: "J",
                description: "Aumentare progressivamente fino a 8 J/kg (max 360 J) per VF/pVT refrattaria, cioè quando sono necessari più di cinque shock.",
                calculation: "8 J/kg × peso (max 360 J)",
              },
            ],
            additionalInfo:
              "Dopo il 5° shock: Adrenalina 10 microgrammi/kg e Amiodarone 5 mg/kg (max 150 mg).",
          },
        ],
      },
      {
        title: "Iperkaliemia in arresto cardiaco",
        drugs: [
          {
            name: "Insulina rapida",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 0.1,
                unit: "unità",
                description: "Somministrare con glucosio.",
                calculation: "0.1 unità/kg × peso",
              },
            ],
          },
          {
            name: "Glucosio 10%, bolo",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 5,
                unit: "mL",
                description: "Non somministrare calcio.",
                calculation: "5 mL/kg × peso",
              },
            ],
          },
        ],
      },
      {
        title: "Ipokaliemia in arresto cardiaco",
        drugs: [
          {
            name: "Potassio cloruro EV",
            dosages: [
              {
                label: "Dose",
                dosePerKg: 1,
                unit: "mmol",
                description: "Infondere a 2 mmol/min per 10 min, poi somministrare la dose rimanente in 5–10 min. Ripetere se necessario fino a K+ sierico > 2.5 mmol/L. Considerare Mg2+ se ipomagnesiemia.",
                calculation: "1 mmol/kg × peso",
              },
            ],
            additionalInfo:
              "Velocità infusione: 2 mmol/min × 10 min per la prima parte, poi dose rimanente in 5–10 min",
          },
        ],
      },
    ],
  },
  {
    id: "arrhythmias",
    title: "Aritmie – Bradicardia / SVT",
    drugs: [
      {
        name: "Atropina, bradicardia",
        dosages: [
          {
            label: "Dose",
            dosePerKg: 20,
            maxDose: 500,
            unit: "microgrammi",
            description: "20 microgrammi/kg (max 0,5 mg).",
            calculation: "20 microgrammi/kg × peso (max 500 microgrammi)",
          },
        ],
        additionalInfo:
          "Ripetere Atropina ogni 3–5 min se necessario (dose totale max 3 mg).",
      },
      {
        name: "Adenosina, SVT, prima dose",
        dosages: [
          {
            label: "Prima dose",
            dosePerKgMin: 0.1,
            dosePerKgMax: 0.2,
            unit: "mg",
            description: "Assicurare flush rapido con fisiologica e ECG a 12 derivazioni in corso.",
            calculation: "0.1–0.2 mg/kg × peso",
          },
        ],
      },
      {
        name: "Adenosina, SVT, seconda dose",
        dosages: [
          {
            label: "Seconda dose (se SVT persiste dopo ≥1 min)",
            dosePerKg: 0.3,
            maxDose: 18,
            unit: "mg",
            description: "Se la SVT persiste dopo ≥1 min dalla prima dose.",
            calculation: "0.3 mg/kg × peso (max 12–18 mg)",
          },
        ],
      },
    ],
  },
  {
    id: "anaphylaxis",
    title: "Allergia – Anafilassi IM",
    drugs: [
      {
        name: "Adrenalina 1:1000 IM",
        dosages: [
          {
            label: "Dose per età 6–12 anni",
            doseFixed: 0.3,
            unit: "mL",
            description: "300 microgrammi. Predisposto per aggiungere successivamente altre fasce di età.",
            calculation: "Mappatura per età: Età 6–12 anni → 0.30 mL (300 microgrammi)",
          },
        ],
      },
    ],
  },
  {
    id: "hyperkaliemia",
    title: "Metabolico – Iperkaliemia non in arresto",
    drugs: [
      {
        name: "Insulina rapida EV",
        dosages: [
          {
            label: "Dose",
            dosePerKg: 0.1,
            unit: "unità",
            description: "Somministrare con glucosio.",
            calculation: "0.1 unità/kg × peso",
          },
        ],
      },
      {
        name: "Glucosio 10%, infusione EV",
        dosages: [
          {
            label: "Dose",
            dosePerKg: 5,
            unit: "mL",
            description: "Somministrare in 30 min.",
            calculation: "5 mL/kg × peso",
          },
        ],
      },
      {
        name: "Salbutamolo inalatorio",
        dosages: [
          {
            label: "Dose",
            doseFixed: 2.5,
            maxDose: 5,
            unit: "mg",
            description: "Beta-2 agonista inalatorio. Ripetere fino a 5 volte.",
            calculation: "2.5–5 mg",
          },
        ],
      },
      {
        name: "Salbutamolo EV",
        dosages: [
          {
            label: "Prima dose",
            dosePerKg: 5,
            unit: "microgrammi",
            description: "Salbutamolo 5 microgrammi/kg in 5 min; può essere ripetuto fino a una dose totale di 15 microgrammi/kg se necessario.",
            calculation: "5 microgrammi/kg × peso; dose totale fino a 15 microgrammi/kg",
          },
        ],
      },
      {
        name: "Calcio gluconato 10%",
        dosages: [
          {
            label: "Dose",
            dosePerKg: 0.5,
            unit: "mL",
            description: "Se anomalie della conduzione ECG. Poi continuare con infusione contenente glucosio. Controllare K+ e glicemia ogni 15 min per 4 h.",
            calculation: "0.5 mL/kg × peso",
          },
        ],
      },
    ],
  },
  {
    id: "hypoglycemia",
    title: "Metabolico – Ipoglicemia",
    drugs: [
      {
        name: "Glucosio 10% EV/IO bolo",
        dosages: [
          {
            label: "Dose",
            dosePerKg: 2,
            maxDose: 50,
            unit: "mL",
            description: "Per ipoglicemia nota o sospetta. Ricontrollare glicemia 5–10 min dopo la dose e ripetere se necessario.",
            calculation: "2 mL/kg × peso (max 50 mL)",
          },
        ],
      },
    ],
  },
  {
    id: "seizures",
    title: "Neurologia – Convulsioni",
    drugs: [
      {
        name: "Lorazepam",
        dosages: [
          {
            label: "Dose",
            dosePerKg: 0.1,
            maxDose: 4,
            unit: "mg",
            description: "0.1 mg/kg EV/IO (max 4 mg per dose). Può essere ripetuto una volta dopo 10 min se le convulsioni persistono.",
            calculation: "0.1 mg/kg × peso (max 4 mg)",
          },
        ],
        additionalInfo:
          "Considerare ipoglicemia: somministrare glucosio 10% 2 mL/kg e ricontrollare glicemia dopo 5–10 min; ripetere se necessario.",
      },
    ],
  },
];
