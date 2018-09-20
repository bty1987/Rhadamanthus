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

	public DecorationPictureDaoImpl(){
		super(DecorationPicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPicturePO> queryDecorationPictureByOrderId(String orderId) {
		return createCriteria(DecorationPicturePO.class).add(Restrictions.eq(DecorationPicturePO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(DecorationPicturePO.COLUMN_STATUS_STR, DecorationPicturePO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public int countDecorationPicture(String orderId, Integer type) {
		
		String sql = "select count(*) from decoration.decorationpicture where orderId = :orderId and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setInteger("type", type).uniqueResult();

		return count.intValue();
	}
	
}
