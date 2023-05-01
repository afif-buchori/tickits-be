const db = require("../config/supabase");

module.exports = {
  getPrice: (movie_id, teathStudio_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        "select price from teather_studio where movie_id=$1 and id=$2",
        [movie_id, teathStudio_id],
        (error, result) => {
          if (error) reject(error);
          else resolve(result.rows);
        }
      );
    });
  },
  addOrder: ({
    user_id,
    movie_id,
    teathStudio_id,
    total_price,
    payment_id,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into history(user_id, movie_id, teathstudio_id, total_price, payment_id, created_at) values ($1, $2, $3, $4, $5, now()) returning id",
        [user_id, movie_id, teathStudio_id, total_price, payment_id],
        (error, result) => {
          if (error) reject(error);
          else resolve(result.rows);
        }
      );
    });
  },
  addTransaction: (id, seat) => {
    let query =
      "insert into transaction(history_id, block_name, block_number) values ";
    let values = [];
    seat.forEach((element, i) => {
      const { block_name, block_number } = element;
      if (values.length) {
        query += ", ";
      }
      query += `($${1 + 3 * i}, $${2 + 3 * i}, $${3 + 3 * i})`;
      values.push(id, block_name, block_number);
    });
    return new Promise((resolve, reject) => {
      db.query(query, values, (error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
  getTransactionById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("select * from history where id=$1", [id], (error, result) => {
        if (error) reject(error);
        else resolve(result.rows);
      });
    });
  },
};