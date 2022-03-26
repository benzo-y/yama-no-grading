// ダミーデータ
import nagano from './nagano.json';
import yamanashi from './yamahashi.json'
import hyaku from './hyaku.json';

const gradingData = {
  nagano,
  yamanashi,
  shizuoka: [],
  gunma: [],
  gifu: [],
  tochigi: [],
  ishizuchisankei: [],
  akita: [],
  toyama: [
    {
      "index": 1,
      "name": "Dummy2",
      "physical": 1,
      "technological": "A",
      "start_point_name": "hoge",
      "start_point_elevation": 1234,
      "highest_point_name": "hoge",
      "highest_point_elevation": 1234,
      "end_point_name": "hoge",
      "end_point_elevation": 1234,
      "course_time": "12:34",
      "length": 12,
      "cum_up_elevation": 1234,
      "cum_down_elevation": 1234,
      "route_coef": 1.2
    }
  ],
  hyaku
};

export default gradingData;