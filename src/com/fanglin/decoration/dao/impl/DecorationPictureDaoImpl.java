/**
 * @File Name		: OrderDesignPictureDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationPictureDao;
import com.fanglin.decoration.po.DecorationPicturePO;

@Repository("orderDesignPictureDao")
public class DecorationPictureDaoImpl extends DaoImpl<DecorationPicturePO> implements DecorationPictureDao {

	public DecorationPictureDaoImpl() {
		super(DecorationPicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPicturePO> queryDecorationPictureByOrderId(String orderId) {
		return createCriteria(DecorationPicturePO.class).add(Restrictions.eq(DecorationPicturePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(DecorationPicturePO.COLUMN_STATUS_STR, DecorationPicturePO.STATUS_ENABLE_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPicturePO> queryDecorationPictureByOrderId(String orderId, short status) {
		return createCriteria(DecorationPicturePO.class).add(Restrictions.eq(DecorationPicturePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(DecorationPicturePO.COLUMN_STATUS_STR, status)).list();
	}

	@Override
	public int countDecorationPicture(String orderId, Integer type) {

		String sql = "select count(*) from decoration.decorationpicture where orderId = :orderId and type = :type and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setInteger("type", type).uniqueResult();

		return count.intValue();
	}

	@Override
	public int batchDecorationPicture(List<Long> dpids, short status) {

		if (dpids == null || dpids.isEmpty()) {
			return 0;
		}

		String sql = "update decoration.decorationpicture set status = :status where dpId in :dpids";

		return session().createSQLQuery(sql).setShort("status", status).setParameterList("dpids", dpids).executeUpdate();
	}

	@Override
	public int batchDecorationPicture(String orderId, List<Long> dpids, short status) {

		if (dpids == null || dpids.isEmpty()) {
			return 0;
		}

		// 如果设置为"本次确认展示"，先清除其他图片的展示状态
		if (status == DecorationPicturePO.STATUS_CONFIRM_SHOW_INT) {
			String clearSql = "update decoration.decorationpicture set status = 1 where orderId = :orderId and status = 4";
			session().createSQLQuery(clearSql).setString("orderId", orderId).executeUpdate();
		}

		// 批量更新选中的图片
		String updateSql = "update decoration.decorationpicture set status = :status where dpId in :dpids";
		return session().createSQLQuery(updateSql).setShort("status", status).setParameterList("dpids", dpids).executeUpdate();
	}

	@Override
	public int clearDecorationPicture(String orderId) {

		String sql = "update decoration.decorationpicture set status = 0 where orderId = :orderId and status = 4";

		return session().createSQLQuery(sql).setString("orderId", orderId).executeUpdate();
	}

}
