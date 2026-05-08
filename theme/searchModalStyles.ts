// theme/searchModalStyles.ts

import { StyleSheet } from 'react-native';

export const searchModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 30,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  clearBtn: {
    position: 'absolute',
    right: 8,
    padding: 6,
  },
  clearBtnTxt: {
    fontSize: 14,
    color: '#64748B',
  },

  title: {
    fontSize: 22,
    marginTop: 0,
    marginBottom: -10,
  },

  card: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    fontSize: 18,
    marginBottom: 8,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  chip: {
    borderWidth: 2,
    borderColor: '#173c68',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    backgroundColor: '#173c68',
  },
  chipPressed: {
    backgroundColor: 'rgba(59,91,253,0.08)',
  },
  chipText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
  },

  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  closeText: {
    color: '#007AFF',
    fontSize: 16,
  },
});