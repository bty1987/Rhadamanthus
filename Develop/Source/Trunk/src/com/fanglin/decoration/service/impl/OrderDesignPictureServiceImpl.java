/**
 * @File Name		: OrderDesignPictureServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.DecorationOrderDrawLineDao;
import com.fanglin.construction.po.DecorationOrderDrawLinePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.dao.OrderDesignPictureDao;
import com.fanglin.decoration.po.OrderDesignPicturePO;
import com.fanglin.decoration.service.OrderDesignPictureService;
import com.fanglin.decoration.vo.OrderDesignPictureVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("orderDesignPictureService")
@Transactional(readOnly=true)
public class OrderDesignPictureServiceImpl implements OrderDesignPictureService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	@Autowired
	private OrderDesignPictureDao orderDesignPictureDao;
	
	@Autowired
	private DecorationOrderDao  decorationOrderDao;
	
	@Autowired
	private DecorationOrderDrawLineDao decorationOrderDrawLineDao;
	
	@Override
	public List<OrderDesignPictureVO> queryOrderDesignPictureByOrderId(OrderDesignPictureVO orderDesignPictureVO){
		
		List<OrderDesignPicturePO> orderDesignPicturePOs = orderDesignPictureDao.queryOrderDesignPictureByOrderId(orderDesignPictureVO.getOrderId());
		List<OrderDesignPictureVO> orderDesignPicListVOs = new ArrayList<OrderDesignPictureVO>();
		
		for(OrderDesignPicturePO orderDesignPicturePO: orderDesignPicturePOs){
			OrderDesignPictureVO _orderDesignPictureVO = new OrderDesignPictureVO();
			
			BeanUtil.copyProperties(orderDesignPicturePO, _orderDesignPictureVO);
			
			_orderDesignPictureVO.setCustomer(orderDesignPicturePO.getOrderPO().getCustomerPO().getCustomerName());
			_orderDesignPictureVO.setCustomerId(orderDesignPicturePO.getOrderPO().getCustomerPO().getId());
			
			_orderDesignPictureVO.setHouseArea(orderDesignPicturePO.getOrderPO().getHouseArea());
			_orderDesignPictureVO.setHouseClass(orderDesignPicturePO.getOrderPO().getHouseClass());
			_orderDesignPictureVO.setOrderId(orderDesignPicturePO.getOrderPO().getOrderId());
			_orderDesignPictureVO.setUserId(orderDesignPicturePO.getUserPO().getUserId());
			
			orderDesignPicListVOs.add(_orderDesignPictureVO);
		}
		return orderDesignPicListVOs;
	}
	
	@Override
	public List<OrderDesignPictureVO> queryOrderDesignPictureForCADByOrderId(OrderDesignPictureVO orderDesignPictureVO){
		
		List<OrderDesignPictureVO> orderDesignPicListVOs = new ArrayList<OrderDesignPictureVO>();
		List<OrderDesignPicturePO> orderDesignPicturePOs = orderDesignPictureDao.queryOrderDesignPictureForCADByOrderId(orderDesignPictureVO.getOrderId());
		
		for(OrderDesignPicturePO orderDesignPicturePO: orderDesignPicturePOs){
			OrderDesignPictureVO _orderDesignPictureVO = new OrderDesignPictureVO();
			
			BeanUtil.copyProperties(orderDesignPicturePO, _orderDesignPictureVO);
			
			_orderDesignPictureVO.setCustomer(orderDesignPicturePO.getOrderPO().getCustomerPO().getCustomerName());
			_orderDesignPictureVO.setCustomerId(orderDesignPicturePO.getOrderPO().getCustomerPO().getId());
			
			_orderDesignPictureVO.setHouseArea(orderDesignPicturePO.getOrderPO().getHouseArea());
			_orderDesignPictureVO.setHouseClass(orderDesignPicturePO.getOrderPO().getHouseClass());
			_orderDesignPictureVO.setOrderId(orderDesignPicturePO.getOrderPO().getOrderId());
			_orderDesignPictureVO.setUserId(orderDesignPicturePO.getUserPO().getUserId());
			
			orderDesignPicListVOs.add(_orderDesignPictureVO);
		}
		return orderDesignPicListVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addOrderDesignPicture(OrderDesignPictureVO orderDesignPicture) throws FLException{
		OrderDesignPicturePO orderDesignPicturePO = new OrderDesignPicturePO();

		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLineByOrderId(orderDesignPicture.getOrderId());
		long limitTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
		
		if(decorationOrderDrawLinePOs == null || decorationOrderDrawLinePOs.size()==0 || decorationOrderDrawLinePOs.get(0).getActualStartTime() == null || decorationOrderDrawLinePOs.get(0).getActualStartTime().getTime() >= limitTime){ // 放线3天前
			
			BeanUtil.copyProperties(orderDesignPicture, orderDesignPicturePO);
			orderDesignPicturePO.setOrderPO(decorationOrderDao.queryOrderByOrderId(orderDesignPicture.getOrderId()));
			
			UserPO userPO = new UserPO();
			userPO.setUserId(orderDesignPicture.getUserId());
			orderDesignPicturePO.setUserPO(userPO);
			
			orderDesignPictureDao.saveOrUpdate(orderDesignPicturePO);
			
			return 0;
		}
		
		throw new FLException(140012, "放线前3天后不可以修改设计图相关信息");
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addOrderDesignPictureForCAD(OrderDesignPictureVO orderDesignPicture){

		OrderDesignPicturePO orderDesignPicturePO = new OrderDesignPicturePO();
		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLineByOrderId(orderDesignPicture.getOrderId());
		long limitTime = new Date().getTime()+3*24*60*60*1000;
		
		if(decorationOrderDrawLinePOs == null || decorationOrderDrawLinePOs.size() == 0 || decorationOrderDrawLinePOs.get(0).getActualStartTime() == null || decorationOrderDrawLinePOs.get(0).getActualStartTime().getTime() >= limitTime){//放线3天前
			List<OrderDesignPicturePO> orderDesignPicturePOs = orderDesignPictureDao.queryOrderDesignPictureForCADByOrderId(orderDesignPicture.getOrderId());
			
			if(orderDesignPicturePOs != null && orderDesignPicturePOs.size() >= 3){ // 多于3个
				orderDesignPicturePO =  orderDesignPicturePOs.get(2);
			}
			
			BeanUtil.copyProperties(orderDesignPicture, orderDesignPicturePO);
			orderDesignPicturePO.setOrderPO(decorationOrderDao.queryOrderByOrderId(orderDesignPicture.getOrderId()));
			
			UserPO userPO = new UserPO();
			userPO.setUserId(orderDesignPicture.getUserId());
			orderDesignPicturePO.setUserPO(userPO);
			
			orderDesignPictureDao.saveOrUpdate(orderDesignPicturePO);
			
			return 0;
		}
		
		return 1;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteOrderDesignPictureByIdAndOrderId(OrderDesignPictureVO orderDesignPicture) throws FLException{
		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLineByOrderId(orderDesignPicture.getOrderId());
		
		long limitTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
		
		if(decorationOrderDrawLinePOs == null || decorationOrderDrawLinePOs.size() == 0 || decorationOrderDrawLinePOs.get(0).getActualStartTime() == null || decorationOrderDrawLinePOs.get(0).getActualStartTime().getTime() >= limitTime){//放线3天前
			
			orderDesignPictureDao.deleteById(orderDesignPicture.getAutoId());
			
			return 0;
		}
		
		throw new FLException(140012, "放线前3天后不可以修改设计图相关信息");
	}
}
