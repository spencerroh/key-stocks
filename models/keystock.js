'use strict';

const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KeyStock extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        static async lastUpdatedDate() {
            var lastUpdatedStock = await this.findOne({
                order: [
                    ['date', 'DESC']
                ]
            });

            return lastUpdatedStock?.date;
        }

        static async lastUpdatedStocks(raw = false) {
            var date = await this.lastUpdatedDate();

            var results = await this.findAll({
                where: {
                    date: date
                },
                raw : raw
            });

            return {
                date: date,
                stocks: results
            }
        }

        static async findRelatedStocks(keywords, offset, limit, raw = false) {
            var conditions = [];
            keywords.forEach(keyword => {
                conditions.push({
                    reason: { [Op.like]: '%' + keyword + '%' }
                });
            });

            var { count, rows } = await this.findAndCountAll({
                where: {
                    [Op.and]: conditions
                },
                order: [
                    ['name', 'DESC']
                ],
                offset: offset,
                limit: limit,
                raw: raw
            });

            console.log(offset, limit, rows);
          
            return {
                count: count,
                stocks: rows
            }
        }
    }

    KeyStock.init({
        name: DataTypes.STRING,
        code: DataTypes.STRING,
        reason: DataTypes.STRING,
        date: DataTypes.DATEONLY
    }, {
        sequelize,
        modelName: 'KeyStock',
    });

    return KeyStock;
};