// ============================================================
// CREATE LIST MODAL — Apana Store
//
// Bottom-sheet modal for creating a new shared shopping list.
// Steps:
//   1. Enter a list name
//   2. Pick a contact to share with
//   3. Tap "Create & Share" — creates the list and sends it
// ============================================================

import React, { useState } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { MOCK_CONTACTS, Contact } from "../../data/sharedListData";

interface CreateListModalProps {
  visible:  boolean;
  onClose:  () => void;
  onCreate: (name: string, contact: Contact) => void;
}

export default function CreateListModal({ visible, onClose, onCreate }: CreateListModalProps) {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();

  const [listName,  setListName]  = useState("");
  const [selected,  setSelected]  = useState<Contact | null>(null);

  function handleCreate() {
    const name = listName.trim();
    if (!name || !selected) return;
    onCreate(name, selected);
    setListName("");
    setSelected(null);
    onClose();
  }

  const canCreate = listName.trim().length > 0 && selected !== null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>

      {/* Scrim */}
      <Pressable style={styles.scrim} onPress={onClose} />

      {/* Sheet */}
      <View style={[styles.sheet, {
        backgroundColor:  colors.card,
        paddingBottom:    insets.bottom + 16,
      }]}>
        {/* Handle bar */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            New Shared List
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.subText} />
          </TouchableOpacity>
        </View>

        {/* List name input */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            List name
          </Text>
          <TextInput
            style={[styles.input, {
              color:           colors.text,
              borderColor:     colors.border,
              backgroundColor: colors.background,
              fontFamily:      typography.fontFamily.regular,
              fontSize:        typography.size.sm,
            }]}
            placeholder="e.g. Weekly Groceries, Party Supplies…"
            placeholderTextColor={colors.subText}
            value={listName}
            onChangeText={setListName}
            autoFocus
            returnKeyType="next"
          />
        </View>

        {/* Contact picker */}
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            Share with
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactsRow}>
            {MOCK_CONTACTS.map(contact => {
              const isSelected = selected?.id === contact.id;
              return (
                <TouchableOpacity
                  key={contact.id}
                  style={[styles.contactChip, {
                    backgroundColor: isSelected ? contact.color          : colors.background,
                    borderColor:     isSelected ? contact.color          : colors.border,
                  }]}
                  onPress={() => setSelected(isSelected ? null : contact)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.chipAvatar, {
                    backgroundColor: isSelected ? "rgba(255,255,255,0.3)" : contact.color,
                  }]}>
                    <Text style={[styles.chipAvatarText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                      {contact.initials}
                    </Text>
                  </View>
                  <Text style={[styles.chipName, {
                    color:      isSelected ? "#fff" : colors.text,
                    fontFamily: isSelected ? typography.fontFamily.bold : typography.fontFamily.regular,
                    fontSize:   typography.size.xs,
                  }]}>
                    {contact.name.split(" ")[0]}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Info note */}
        <View style={[styles.infoNote, { backgroundColor: colors.primary + "10" }]}>
          <Ionicons name="information-circle-outline" size={15} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {selected
              ? `${selected.name} will receive a notification and can start shopping immediately.`
              : "Select a contact to share this list with."}
          </Text>
        </View>

        {/* Create button */}
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: canCreate ? colors.primary : colors.border }]}
          onPress={handleCreate}
          disabled={!canCreate}
          activeOpacity={0.85}
        >
          <Ionicons name="share-outline" size={18} color="#fff" />
          <Text style={[styles.createText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            Create &amp; Share
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    padding:              20,
    gap:                  16,
  },
  handle: {
    width:        40,
    height:       4,
    borderRadius: 2,
    alignSelf:    "center",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  title: {},

  field:      { gap: 8 },
  fieldLabel: {},
  input: {
    borderWidth:       1,
    borderRadius:      12,
    paddingHorizontal: 14,
    paddingVertical:   11,
  },

  contactsRow: {
    gap:           8,
    paddingRight:  8,
  },
  contactChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      20,
    borderWidth:       1,
  },
  chipAvatar: {
    width:          26,
    height:         26,
    borderRadius:   13,
    alignItems:     "center",
    justifyContent: "center",
  },
  chipAvatarText: { color: "#fff" },
  chipName:       {},

  infoNote: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    padding:           12,
    borderRadius:      12,
  },
  infoText: { flex: 1, lineHeight: 17 },

  createBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    paddingVertical: 14,
    borderRadius:   14,
  },
  createText: { color: "#fff" },
});
