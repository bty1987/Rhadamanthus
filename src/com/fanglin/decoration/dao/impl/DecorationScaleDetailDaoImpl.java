package com.fanglin.decoration.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;

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

		// COUNT(*) 原生查询返回 BigInteger, 强转 BigDecimal 会 ClassCastException
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("daiId", daiId).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public long amountDecorationScaleDetailForScale(String orderId) {

		// 配比净额调整(双重计修正): 券抵额已随收款行referMoney视同已收——计入(0)净额0不重复加, 不计入(1)净额-money从基数剔除
		String sql = "SELECT COALESCE(SUM(CASE WHEN isScale = 0 THEN 0 ELSE -money END), 0) FROM decoration.decorationscaledetail WHERE orderId = :orderId AND status = 0";

		BigDecimal amount = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return amount == null ? 0L : amount.longValue();
	}

	@Override
	public int countDecorationScaleDetailBySpid(long spid) {

		String sql = "SELECT COUNT(*) FROM decoration.decorationscaledetail WHERE spid = :spid AND status = 0";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("spid", spid).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

}
