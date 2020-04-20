import Vue from 'vue';
import { TScoreState } from '@/types/TScoreState';

class Score {
  #state: TScoreState = Vue.observable({
    amount: 0,
    awardValue: 5,
    record: 0,
    storageKey: 'vpg:record',
  });

  get record() {
    return this.#state.record;
  }

  get amount() {
    return this.#state.amount;
  }

  init() {
    const record = this.getRecordFromStorage();

    this.#state.record = Number(record) || 0;
  }

  giveAward() {
    this.#state.amount += this.#state.awardValue;
  }

  resetScore() {
    this.#state.amount = 0;
  }

  updateRecord() {
    const { amount, record } = this.#state;

    this.#state.record = (amount > record)
      ? amount
      : record;

    this.setRecordToStorage();
  }

  private getRecordFromStorage() {
    return localStorage.getItem(this.#state.storageKey);
  }

  private setRecordToStorage() {
    localStorage.setItem(
      this.#state.storageKey,
      String(this.record),
    );
  }
}

const score = new Score();

export { score };
