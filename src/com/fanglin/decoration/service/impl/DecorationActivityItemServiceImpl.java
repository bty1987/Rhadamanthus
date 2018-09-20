/**
 * @File Name		: DecorationActivityItemServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationActivityItemService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationActivityItemService")
@Transactional(readOnly=true)
public class DecorationActivityItemServiceImpl implements DecorationActivityItemService {
	
	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;
	
	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;
	
	@Override
	public List<DecorationActivityItemVO> queryDecorationActivityItemByOrderId(DecorationVO decorationVO) {
		
		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemByOrderId(decorationVO.getOrderId());
		List<DecorationActivityItemVO> decorationActivityItemVOs = new ArrayList<DecorationActivityItemVO>();
		
		for(DecorationActivityItemPO decorationActivityItemPO: decorationActivityItemPOs){
			DecorationActivityItemVO decorationActivityItemVO = new DecorationActivityItemVO();
			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("receiveUserId"));
			decorationActivityItemVO.setReceiveUserId(new UserBaseVO());
			BeanUtil.copyProperties(decorationActivityItemPO.getReceiveUserId(), decorationActivityItemVO.getReceiveUserId(),Arrays.asList("dept","duty"));
			
			
			decorationActivityItemVOs.add(decorationActivityItemVO);
		}
		
		return decorationActivityItemVOs;
	}

	@Override
	public List<DecorationActivityItemVO> queryDecorationActivityItemForCouponAVaildByOrderId(DecorationVO decorationVO) {
		
		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemForCouponAVaildByOrderId(decorationVO.getOrderId());
		List<DecorationActivityItemVO> decorationActivityItemVOs = new ArrayList<DecorationActivityItemVO>();
		
		for(DecorationActivityItemPO decorationActivityItemPO: decorationActivityItemPOs){
			DecorationActivityItemVO decorationActivityItemVO = new DecorationActivityItemVO();
			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO, Arrays.asList("receiveUserId"));
			
			decorationActivityItemVO.setReceiveUserId(new UserBaseVO());
			BeanUtil.copyProperties(decorationActivityItemPO.getReceiveUserId(), decorationActivityItemVO.getReceiveUserId(),Arrays.asList("dept","duty"));
			
			decorationActivityItemVOs.add(decorationActivityItemVO);
		}
		
		return decorationActivityItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int abateDecorationActionItem(DecorationActivityItemVO decorationActivityItemVO) throws FLException {
		
		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
		
		if(decorationActivityItemPO == null){
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationActivityItemPO.getOrderId());
		float couponCut = decorationPO.getCouponCut();
		float thingCut = decorationPO.getThingCut();
		
		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT,DecorationPO.STATUS_DEPOSIT_INT,DecorationPO.STATUS_RESIGNED_INT);
		
		if(!statuses.contains(decorationPO.getStatus())){
			throw new FLException(140003, "装修单已签约");
		}
		
		if(decorationActivityItemPO.getType() == DecorationActivityItemPO.TYPE_COUPON_INT){
			couponCut = Arith.sub(couponCut,Arith.mul(decorationActivityItemPO.getNum(),decorationActivityItemPO.getMoney()));
		}else{
			thingCut = Arith.sub(thingCut,Arith.mul(decorationActivityItemPO.getNum(),decorationActivityItemPO.getMoney()));
		}
		
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);
		
		decorationActivityItemDao.update(decorationActivityItemPO);
		
		decorationPO.setCouponCut(couponCut);
		decorationPO.setThingCut(thingCut);
		decorationDao.update(decorationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId, String userName) throws FLException {
		
		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
		
		if(decorationActivityItemPO == null){
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_RECEIVE_INT);
		decorationActivityItemPO.setReceiveUserId(userDao.queryUserByUserId(userId));
		decorationActivityItemPO.setReceiveUserName(userName);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
		
		decorationActivityItemDao.update(decorationActivityItemPO);
		
		return 0;
	}

}
