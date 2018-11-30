/**
 * @File Name		: OrderBelongInfoServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.service.DecorationBelongService;
import com.fanglin.decoration.vo.DecorationBelongVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("orderBelongInfoService")
@Transactional(readOnly=true)
public class DecorationBelongServiceImpl implements DecorationBelongService {

	@Autowired
	private DecorationBelongDao orderBelongInfoDao;
	
	@Override
	public List<DecorationBelongVO> queryApprovalingOrderBelongInfosByOrderIdAndBelongType(String decorationOrderId,Short belongType){
		
		List<DecorationBelongVO> orderBelongInfoVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoByOrderIdAType(decorationOrderId, belongType);
		
		if(orderBelongInfoPOs == null) {
			return null;
		}
		
		for(DecorationBelongPO orderBelongInfoPO : orderBelongInfoPOs){
			DecorationBelongVO orderBelongInfoVO = new DecorationBelongVO();
			
			if(orderBelongInfoPO.getOperater() != null){
				orderBelongInfoVO.setOperater(new UserBaseVO());
				BeanUtil.copyProperties(orderBelongInfoPO.getOperater(), orderBelongInfoVO.getOperater(), Arrays.asList("dept", "duty"));
				
				orderBelongInfoVO.setOperateTime(orderBelongInfoPO.getOperateTime());
			}
			
			orderBelongInfoVO.setDepartment(new DepartmentVO());
			BeanUtil.copyProperties(orderBelongInfoPO.getDepartment(), orderBelongInfoVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
			
			orderBelongInfoVO.setRegion(new DepartmentVO());
			if(orderBelongInfoPO.getBelonger() != null){
				BeanUtil.copyProperties(orderBelongInfoPO.getRegion(), orderBelongInfoVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			}else{
				BeanUtil.copyProperties("", orderBelongInfoVO.getRegion());
			}
			orderBelongInfoVO.setBelonger(new UserBaseVO());
			BeanUtil.copyProperties(orderBelongInfoPO.getBelonger(), orderBelongInfoVO.getBelonger(), Arrays.asList("dept", "duty"));
			
			orderBelongInfoVO.setRate(orderBelongInfoPO.getRate());
			orderBelongInfoVO.setType(orderBelongInfoPO.getType());
			orderBelongInfoVO.setDbid(orderBelongInfoPO.getDbid());
			orderBelongInfoVO.setDefaultFlag(orderBelongInfoPO.getDefaultFlag());
			
			orderBelongInfoVOs.add(orderBelongInfoVO);
		}
		
		return orderBelongInfoVOs;
	}
	
	@Override
	public List<DecorationBelongVO> queryOrderBelongInfoForChangeByOrderIdAType(String decorationOrderId,Short belongType){
		
		List<DecorationBelongVO> orderBelongInfoVOs = queryApprovalingOrderBelongInfosByOrderIdAndBelongType(decorationOrderId, belongType);
		
		if(orderBelongInfoVOs == null || orderBelongInfoVOs.size() == 0){
			orderBelongInfoVOs = queryOrderBelongInfoForCurrentByOrderIdAType(decorationOrderId, belongType);
		}
		
		return orderBelongInfoVOs;
	}
	
	@Override
	public List<DecorationBelongVO> queryOrderBelongInfoForCurrentByOrderIdAType(String decorationOrderId,Short belongType){
		List<DecorationBelongVO> orderBelongInfoVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> orderBelongInfoPOs =  orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationOrderId, belongType);
		
		for(DecorationBelongPO orderBelongInfoPO: orderBelongInfoPOs){
			DecorationBelongVO orderBelongInfoVO = new DecorationBelongVO();
			
			if(orderBelongInfoPO.getOperater() != null){
				orderBelongInfoVO.setOperater(new UserBaseVO());
				BeanUtil.copyProperties(orderBelongInfoPO.getOperater(), orderBelongInfoVO.getOperater(), Arrays.asList("dept", "duty"));
				
				orderBelongInfoVO.setOperateTime(orderBelongInfoPO.getOperateTime());
			}
			
			orderBelongInfoVO.setDepartment(new DepartmentVO());
			BeanUtil.copyProperties(orderBelongInfoPO.getDepartment(), orderBelongInfoVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
			
			orderBelongInfoVO.setRegion(new DepartmentVO());
			if(orderBelongInfoPO.getRegion() != null){
				BeanUtil.copyProperties(orderBelongInfoPO.getRegion(), orderBelongInfoVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			}else{
				BeanUtil.copyProperties("", orderBelongInfoVO.getRegion());
			}
			orderBelongInfoVO.setBelonger(new UserBaseVO());
			BeanUtil.copyProperties(orderBelongInfoPO.getBelonger(), orderBelongInfoVO.getBelonger(), Arrays.asList("dept", "duty"));
			
			orderBelongInfoVO.setRate(orderBelongInfoPO.getRate());
			orderBelongInfoVO.setType(orderBelongInfoPO.getType());
			orderBelongInfoVO.setDbid(orderBelongInfoPO.getDbid());
			orderBelongInfoVO.setDefaultFlag(orderBelongInfoPO.getDefaultFlag());
			
			orderBelongInfoVOs.add(orderBelongInfoVO);
		}
		
		return orderBelongInfoVOs;
	}

	@Override
	public List<DecorationBelongVO> queryOrderBelongInfoByOrderId(DecorationBelongVO orderBelongInfoVO) {
		
		List<DecorationBelongVO> orderBelongInfoVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongPO> orderBelongInfoPOs =  orderBelongInfoDao.queryOrderBelongInfoByOrderId(orderBelongInfoVO.getOrderId());
		
		for(DecorationBelongPO orderBelongInfoPO: orderBelongInfoPOs){
			DecorationBelongVO _orderBelongInfoVO = new DecorationBelongVO();
			
			if(orderBelongInfoPO.getOperater() != null){
				_orderBelongInfoVO.setOperater(new UserBaseVO());
				BeanUtil.copyProperties(orderBelongInfoPO.getOperater(), _orderBelongInfoVO.getOperater(), Arrays.asList("dept", "duty"));
				
				_orderBelongInfoVO.setOperateTime(orderBelongInfoPO.getOperateTime());
			}
			
			_orderBelongInfoVO.setDepartment(new DepartmentVO());
			BeanUtil.copyProperties(orderBelongInfoPO.getDepartment(), _orderBelongInfoVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
			
			_orderBelongInfoVO.setRegion(new DepartmentVO());
			if(orderBelongInfoPO.getRegion() != null){
				BeanUtil.copyProperties(orderBelongInfoPO.getRegion(), _orderBelongInfoVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
			}else{
				BeanUtil.copyProperties("", _orderBelongInfoVO.getRegion());
			}
			_orderBelongInfoVO.setBelonger(new UserBaseVO());
			BeanUtil.copyProperties(orderBelongInfoPO.getBelonger(), _orderBelongInfoVO.getBelonger(), Arrays.asList("dept", "duty"));
			
			_orderBelongInfoVO.setRate(orderBelongInfoPO.getRate());
			_orderBelongInfoVO.setType(orderBelongInfoPO.getType());
			_orderBelongInfoVO.setDbid(orderBelongInfoPO.getDbid());
			_orderBelongInfoVO.setDefaultFlag(orderBelongInfoPO.getDefaultFlag());
			
			orderBelongInfoVOs.add(_orderBelongInfoVO);
		}
		
		return orderBelongInfoVOs;
	}
	
}
