export const CHATBOT_RESPONSES = {
    greetings: {
      welcome: "👋 Hello! I'm here to help with disaster-related information. You can:",
      options: [
        "• Ask about specific disasters",
        "• Learn prevention measures",
        "• Get emergency guidelines",
        "• Find safety resources"
      ]
    },
  
    quickLinks: [
      {
        text: "How to prepare for floods?",
        type: "floods",
        category: "prevention"
      },
      {
        text: "What to do during an earthquake?",
        type: "earthquakes",
        category: "response"
      },
      {
        text: "Cyclone safety measures?",
        type: "cyclones",
        category: "prevention"
      },
      {
        text: "Fire evacuation guidelines?",
        type: "wildfires",
        category: "response"
      },
      {
        text: "How to prepare for a tsunami?",
        type: "tsunamis",
        category: "prevention"
      },
      {
        text: "What to do during a tornado?",
        type: "tornadoes",
        category: "response"
      },
      {
        text: "Volcano eruption safety tips?",
        type: "volcanoes",
        category: "prevention"
      },
      {
        text: "How to recover after a hurricane?",
        type: "hurricanes",
        category: "recovery"
      }
    ],
  
    categories: {
      prevention: "Prevention & Preparedness",
      response: "Emergency Response",
      recovery: "Post-Disaster Recovery"
    },
  
    keywords: {
      floods: {
        title: "Flood Management",
        prevention: {
          content: "Flood Prevention Guidelines:",
          steps: [
            "• Monitor weather forecasts",
            "• Keep emergency supplies ready",
            "• Know evacuation routes",
            "• Install flood barriers",
            "• Maintain proper drainage"
          ],
          link: "/mitigation/floods"
        },
        response: {
          content: "During Floods:",
          steps: [
            "• Move to higher ground",
            "• Avoid walking in water",
            "• Follow evacuation orders",
            "• Don't drive through floods",
            "• Stay tuned to emergency broadcasts"
          ],
          link: "/mitigation/floods"
        },
        recovery: {
          content: "After Floods:",
          steps: [
            "• Avoid floodwaters; they may be contaminated",
            "• Check for structural damage before entering buildings",
            "• Document damage for insurance claims",
            "• Clean and disinfect affected areas",
            "• Seek professional help for electrical and gas systems"
          ],
          link: "/recovery/floods"
        }
      },
      earthquakes: {
        title: "Earthquake Safety",
        prevention: {
          content: "Earthquake Preparedness:",
          steps: [
            "• Secure heavy furniture",
            "• Know safe spots",
            "• Keep emergency kit ready",
            "• Practice drop, cover, hold",
            "• Plan communication strategy"
          ],
          link: "/mitigation/earthquakes"
        },
        response: {
          content: "During Earthquakes:",
          steps: [
            "• Drop, cover, and hold on",
            "• Stay away from windows",
            "• If indoors, stay inside",
            "• If outside, move to open area",
            "• Be prepared for aftershocks"
          ],
          link: "/mitigation/earthquakes"
        },
        recovery: {
          content: "After Earthquakes:",
          steps: [
            "• Check for injuries and provide first aid",
            "• Inspect your home for damage",
            "• Avoid damaged buildings and areas",
            "• Listen to official updates",
            "• Be prepared for aftershocks"
          ],
          link: "/recovery/earthquakes"
        }
      },
      cyclones: {
        title: "Cyclone Safety",
        prevention: {
          content: "Cyclone Preparedness:",
          steps: [
            "• Secure outdoor objects",
            "• Reinforce windows and doors",
            "• Prepare an emergency kit",
            "• Know evacuation routes",
            "• Stay informed about weather updates"
          ],
          link: "/mitigation/cyclones"
        },
        response: {
          content: "During Cyclones:",
          steps: [
            "• Stay indoors and away from windows",
            "• Turn off utilities if instructed",
            "• Use a battery-powered radio for updates",
            "• Avoid using the phone except for emergencies",
            "• Stay in a small, windowless, interior room"
          ],
          link: "/mitigation/cyclones"
        },
        recovery: {
          content: "After Cyclones:",
          steps: [
            "• Avoid floodwaters and downed power lines",
            "• Check for gas leaks and electrical damage",
            "• Document property damage",
            "• Contact your insurance company",
            "• Seek assistance if needed"
          ],
          link: "/recovery/cyclones"
        }
      },
      wildfires: {
        title: "Wildfire Safety",
        prevention: {
          content: "Wildfire Prevention:",
          steps: [
            "• Create a defensible space around your home",
            "• Remove flammable materials",
            "• Use fire-resistant building materials",
            "• Have an evacuation plan",
            "• Stay informed about fire risks"
          ],
          link: "/mitigation/wildfires"
        },
        response: {
          content: "During Wildfires:",
          steps: [
            "• Evacuate immediately if ordered",
            "• Wear protective clothing",
            "• Close all windows and doors",
            "• Shut off gas and propane",
            "• Stay low to avoid smoke inhalation"
          ],
          link: "/mitigation/wildfires"
        },
        recovery: {
          content: "After Wildfires:",
          steps: [
            "• Wait for official clearance before returning",
            "• Be cautious of hot spots and embers",
            "• Inspect your home for damage",
            "• Document damage for insurance",
            "• Seek mental health support if needed"
          ],
          link: "/recovery/wildfires"
        }
      },
      tsunamis: {
        title: "Tsunami Safety",
        prevention: {
          content: "Tsunami Preparedness:",
          steps: [
            "• Know the warning signs",
            "• Identify evacuation routes",
            "• Prepare an emergency kit",
            "• Stay informed about tsunami risks",
            "• Practice evacuation drills"
          ],
          link: "/mitigation/tsunamis"
        },
        response: {
          content: "During Tsunamis:",
          steps: [
            "• Move to higher ground immediately",
            "• Follow evacuation routes",
            "• Avoid the coast",
            "• Stay tuned to emergency broadcasts",
            "• Do not return until authorities say it's safe"
          ],
          link: "/mitigation/tsunamis"
        },
        recovery: {
          content: "After Tsunamis:",
          steps: [
            "• Avoid floodwaters and debris",
            "• Check for injuries and provide first aid",
            "• Inspect your home for damage",
            "• Document damage for insurance",
            "• Seek assistance if needed"
          ],
          link: "/recovery/tsunamis"
        }
      },
      tornadoes: {
        title: "Tornado Safety",
        prevention: {
          content: "Tornado Preparedness:",
          steps: [
            "• Identify a safe room",
            "• Prepare an emergency kit",
            "• Stay informed about weather updates",
            "• Know the difference between a watch and a warning",
            "• Practice tornado drills"
          ],
          link: "/mitigation/tornadoes"
        },
        response: {
          content: "During Tornadoes:",
          steps: [
            "• Seek shelter immediately",
            "• Go to a basement or interior room",
            "• Stay away from windows",
            "• Protect your head and neck",
            "• Use a mattress or heavy blankets for cover"
          ],
          link: "/mitigation/tornadoes"
        },
        recovery: {
          content: "After Tornadoes:",
          steps: [
            "• Check for injuries and provide first aid",
            "• Avoid downed power lines",
            "• Inspect your home for damage",
            "• Document damage for insurance",
            "• Seek assistance if needed"
          ],
          link: "/recovery/tornadoes"
        }
      },
      volcanoes: {
        title: "Volcano Safety",
        prevention: {
          content: "Volcano Preparedness:",
          steps: [
            "• Know the evacuation routes",
            "• Prepare an emergency kit",
            "• Stay informed about volcanic activity",
            "• Protect your home from ash",
            "• Have a communication plan"
          ],
          link: "/mitigation/volcanoes"
        },
        response: {
          content: "During Volcanic Eruptions:",
          steps: [
            "• Follow evacuation orders",
            "• Avoid river valleys and low-lying areas",
            "• Protect yourself from ashfall",
            "• Stay tuned to emergency broadcasts",
            "• Use masks to avoid inhaling ash"
          ],
          link: "/mitigation/volcanoes"
        },
        recovery: {
          content: "After Volcanic Eruptions:",
          steps: [
            "• Avoid ash-covered areas",
            "• Clear ash from roofs and gutters",
            "• Check for injuries and provide first aid",
            "• Document damage for insurance",
            "• Seek assistance if needed"
          ],
          link: "/recovery/volcanoes"
        }
      },
      hurricanes: {
        title: "Hurricane Safety",
        prevention: {
          content: "Hurricane Preparedness:",
          steps: [
            "• Secure your home",
            "• Prepare an emergency kit",
            "• Know evacuation routes",
            "• Stay informed about hurricane updates",
            "• Protect windows with shutters or plywood"
          ],
          link: "/mitigation/hurricanes"
        },
        response: {
          content: "During Hurricanes:",
          steps: [
            "• Stay indoors and away from windows",
            "• Turn off utilities if instructed",
            "• Use a battery-powered radio for updates",
            "• Avoid using the phone except for emergencies",
            "• Stay in a small, windowless, interior room"
          ],
          link: "/mitigation/hurricanes"
        },
        recovery: {
          content: "After Hurricanes:",
          steps: [
            "• Avoid floodwaters and downed power lines",
            "• Check for gas leaks and electrical damage",
            "• Document property damage",
            "• Contact your insurance company",
            "• Seek assistance if needed"
          ],
          link: "/recovery/hurricanes"
        }
      }
    },
  
    suggestions: [
      "Show me flood prevention tips",
      "Earthquake safety measures",
      "How to prepare for cyclones",
      "What to do in a wildfire",
      "Emergency contacts",
      "How to prepare for a tsunami",
      "What to do during a tornado",
      "Volcano eruption safety tips",
      "How to recover after a hurricane"
    ],
  
    help: {
      content: "I can help you with:",
      options: [
        "• Disaster prevention tips",
        "• Emergency response guidelines",
        "• Safety measures",
        "• Emergency contacts",
        "• Evacuation procedures"
      ],
      note: "Click on any suggestion or type your question!"
    },
  
    fallback: [
      "I'm not sure about that. Try asking about specific disasters or click one of the suggestions below.",
      "I specialize in disaster-related information. Please choose from the suggested topics or ask about a specific disaster.",
      "Could you rephrase that? You can also click one of the suggested topics below."
    ],
      
         emergencyContacts: {
          content: "Here are some important emergency contacts for India:",
          contacts: [
            {
              name: "National Emergency Number",
              number: "112"
            },
            {
              name: "Police",
              number: "100"
            },
            {
              name: "Fire Brigade",
              number: "101"
            },
            {
              name: "Ambulance",
              number: "102"
            },
            {
              name: "Disaster Management Helpline",
              number: "1070"
            },
            {
              name: "Women's Helpline",
              number: "1091"
            },
            {
              name: "Child Helpline",
              number: "1098"
            },
            {
              name: "NDMA (National Disaster Management Authority)",
              number: "011-26701728"
            },
            {
              name: "Indian Red Cross Society",
              number: "011-23716441"
            },
            {
              name: "Cyclone Warning Center",
              number: "0891-2565597"
            },
            {
              name: "Earthquake Helpline",
              number: "011-24363260"
            }
          ],
          note: "Save these numbers in your phone for quick access during emergencies. Stay safe!"
        }
      };