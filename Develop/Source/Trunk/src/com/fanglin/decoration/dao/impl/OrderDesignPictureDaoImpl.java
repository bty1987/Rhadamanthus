/**
 * @File Name		: OrderDesignPictureDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.OrderDesignPictureDao;
import com.fanglin.decoration.po.OrderDesignPicturePO;

@Repository("orderDesignPictureDao")
public class OrderDesignPictureDaoImpl extends DaoImpl<OrderDesignPicturePO> implements OrderDesignPictureDao {

	public OrderDesignPictureDaoImpl(){
		super(OrderDesignPicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OrderDesignPicturePO> queryOrderDesignPictureByOrderId(String orderId){
		return createCriteria(OrderDesignPicturePO.class)
				.add(Restrictions.eq("orderPO.orderId", orderId))
				.add(Restrictions.eq("pictureType", 1))
				.addOrder(Order.desc("uploadTime"))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<OrderDesignPicturePO> queryOrderDesignPictureForCADByOrderId(String orderId){
		return createCriteria(OrderDesignPicturePO.class)
				.add(Restrictions.eq("orderPO.orderId", orderId))
				.add(Restrictions.eq("pictureType", 0))
				.addOrder(Order.desc("uploadTime"))
				.list();
	}

}
