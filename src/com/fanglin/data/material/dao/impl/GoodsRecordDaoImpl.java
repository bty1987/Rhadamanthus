package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.GoodsRecordDao;
import com.fanglin.data.po.GoodsRecordPO;
import com.fanglin.utils.Paging;

@Repository("goodsRecordDao")
public class GoodsRecordDaoImpl extends DaoImpl<GoodsRecordPO> implements GoodsRecordDao {

	public GoodsRecordDaoImpl() {
		super(GoodsRecordPO.class);
	}

	@Override
	public List<GoodsRecordPO> pageGoodsRecord(Paging paging, List<Filter> filters, Long gid) {

		PagingQuery<GoodsRecordPO> query = pagingQuery(paging, GoodsRecordPO.class);

		if (gid != null) query.alias("goods", "goods").add(query.getCriterion(GoodsRecordPO.COLUMN_GOODS_STR, gid, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (GoodsRecordPO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (GoodsRecordPO.COLUMN_OPERATOR_STR.equals(field)) {
				query.alias("operator", "operator");
				query.add(query.getCriterion(field, data, op));
			} else if (GoodsRecordPO.COLUMN_OPERATETIME_STR.equals(field)) {
				query.timeranges(field, field, data);
			}
		}
	}

}
