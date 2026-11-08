package com.fanglin.decoration.dao.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationScaleDetailDao;
import com.fanglin.decoration.po.DecorationScaleDetailPO;

@Repository("decorationScaleDetailDao")
public class DecorationScaleDetailDaoImpl extends DaoImpl<DecorationScaleDetailPO> implements DecorationScaleDetailDao {

	public DecorationScaleDetailDaoImpl() {
		super(DecorationScaleDetailPO.class);
	}

	@Override
	public int countDecorationScaleDetailByDaiId(long daiId) {

		String sql = "SELECT COUNT(*) FROM decoration.decorationscaledetail WHERE daiId = :daiId AND status = 0";

		BigDecimal count = (BigDecimal) session().createSQLQuery(sql).setLong("daiId", daiId).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public long amountDecorationScaleDetailForScale(String orderId) {

		String sql = "SELECT COALESCE(SUM(money), 0) FROM decoration.decorationscaledetail WHERE orderId = :orderId AND isScale = 0 AND status = 0";

		BigDecimal amount = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return amount == null ? 0L : amount.longValue();
	}

}
