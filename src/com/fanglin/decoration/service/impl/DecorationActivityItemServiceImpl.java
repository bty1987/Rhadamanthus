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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.service.DecorationActivityItemService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationActivityItemService")
@Transactional(readOnly=true)
public class DecorationActivityItemServiceImpl implements DecorationActivityItemService {
	
	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Override
	public List<DecorationActivityItemVO> queryDecorationActivityItemByOrderId(DecorationVO decorationVO) {
		
		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItemByOrderId(decorationVO.getOrderId());
		List<DecorationActivityItemVO> decorationActivityItemVOs = new ArrayList<DecorationActivityItemVO>();
		
		for(DecorationActivityItemPO decorationActivityItemPO: decorationActivityItemPOs){
			DecorationActivityItemVO decorationActivityItemVO = new DecorationActivityItemVO();
			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO);
			
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
			BeanUtil.copyProperties(decorationActivityItemPO, decorationActivityItemVO);
			
			decorationActivityItemVOs.add(decorationActivityItemVO);
		}
		
		return decorationActivityItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int convertDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO) throws FLException {
		
		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
		
		if(decorationActivityItemPO == null){
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		if(decorationActivityItemPO.getType() != DecorationActivityItemPO.TYPE_THING_INT){
			throw new FLException(140031, "订单活动物品类型不能够抵现");
		}
		
		DecorationActivityItemPO _decorationActivityItemPO = new DecorationActivityItemPO();
		BeanUtil.copyProperties(decorationActivityItemPO, _decorationActivityItemPO, DecorationActivityItemPO.COLUMN_DAIID_STR);
		
		_decorationActivityItemPO.setActivityName("物品抵现");
		_decorationActivityItemPO.setActivityItemName(decorationActivityItemPO.getActivityItemName() + "抵现");
		_decorationActivityItemPO.setContent(String.valueOf(decorationActivityItemPO.getDaiId()));
		_decorationActivityItemPO.setNum(1);
		_decorationActivityItemPO.setMoney(decorationActivityItemVO.getMoney());
		_decorationActivityItemPO.setAid(decorationActivityItemPO.getAid());
		_decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_VAILD_INT);
		_decorationActivityItemPO.setType(DecorationActivityItemPO.TYPE_COUPON_INT);
		
		decorationActivityItemDao.save(_decorationActivityItemPO);
		
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);
		
		decorationActivityItemDao.save(decorationActivityItemPO);
		
		BeanUtil.copyProperties(_decorationActivityItemPO, decorationActivityItemVO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int abateDecorationActionItem(	DecorationActivityItemVO decorationActivityItemVO) throws FLException {
		
		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
		
		if(decorationActivityItemPO == null){
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);
		
		decorationActivityItemDao.update(decorationActivityItemPO);
		
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
		decorationActivityItemPO.setReceiveUserId(userId);
		decorationActivityItemPO.setReceiveUserName(userName);
		decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
		
		decorationActivityItemDao.update(decorationActivityItemPO);
		
		return 0;
	}

}
