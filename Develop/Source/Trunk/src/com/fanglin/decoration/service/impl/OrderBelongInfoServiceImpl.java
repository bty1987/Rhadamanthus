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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.dao.OrderBelongInfoDao;
import com.fanglin.decoration.po.OrderBelongInfoPO;
import com.fanglin.decoration.service.OrderBelongInfoService;
import com.fanglin.decoration.vo.OrderBelongInfoVO;

@Service("orderBelongInfoService")
@Transactional(readOnly=true)
public class OrderBelongInfoServiceImpl implements OrderBelongInfoService {

	@Autowired
	private OrderBelongInfoDao orderBelongInfoDao;
	
	@Override
	public List<OrderBelongInfoVO> queryApprovalingOrderBelongInfosByOrderIdAndBelongType(String decorationOrderId,String belongType){
		
		List<OrderBelongInfoVO> orderBelongInfoVOs = new ArrayList<OrderBelongInfoVO>();
		List<OrderBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoByOrderIdAType(decorationOrderId, belongType);
		
		if(orderBelongInfoPOs == null) {
			return null;
		}
		
		for(OrderBelongInfoPO orderBelongInfoPO : orderBelongInfoPOs){
			OrderBelongInfoVO orderBelongInfoVO = new OrderBelongInfoVO();
			if(orderBelongInfoPO.getApprovalUserPO() != null){
				orderBelongInfoVO.setApprovalUser(orderBelongInfoPO.getApprovalUserPO().getCurrentName());
				orderBelongInfoVO.setApprovalTime(orderBelongInfoPO.getApprovalTime());
				orderBelongInfoVO.setApprovalUserId(orderBelongInfoPO.getApprovalUserPO().getUserId());
			}
			
			if(orderBelongInfoPO.getOperateUserPO() != null){
				orderBelongInfoVO.setOperateUser(orderBelongInfoPO.getOperateUserPO().getCurrentName());
				orderBelongInfoVO.setOperateUserId(orderBelongInfoPO.getOperateUserPO().getUserId());
				orderBelongInfoVO.setOperateTime(orderBelongInfoPO.getOperateTime());
			}
			
			orderBelongInfoVO.setBelongDept(orderBelongInfoPO.getBelongDeptPO().getDeptName());
			orderBelongInfoVO.setBelongDeptId(orderBelongInfoPO.getBelongDeptPO().getDeptId());
			if(orderBelongInfoPO.getBelongRegionPO() != null){
				orderBelongInfoVO.setBelongRegion(orderBelongInfoPO.getBelongRegionPO().getDeptName());
				orderBelongInfoVO.setBelongRegionId(orderBelongInfoPO.getBelongRegionPO().getDeptId());
			}else{
				orderBelongInfoVO.setBelongRegion("");
				orderBelongInfoVO.setBelongRegionId("");
			}
			orderBelongInfoVO.setBelongUser(orderBelongInfoPO.getBelongUserPO().getCurrentName());
			orderBelongInfoVO.setBelongUserId(orderBelongInfoPO.getBelongUserPO().getUserId());
			orderBelongInfoVO.setBelongRate(orderBelongInfoPO.getBelongRate());
			orderBelongInfoVO.setBelongType(orderBelongInfoPO.getBelongType());
			orderBelongInfoVO.setAutoId(orderBelongInfoPO.getAutoId());
			orderBelongInfoVO.setDefaultFlag(orderBelongInfoPO.getDefaultFlag());
			
			orderBelongInfoVOs.add(orderBelongInfoVO);
		}
		
		return orderBelongInfoVOs;
	}
	
	@Override
	public List<OrderBelongInfoVO> queryOrderBelongInfoForChangeByOrderIdAType(String decorationOrderId,String belongType){
		
		List<OrderBelongInfoVO> orderBelongInfoVOs = queryApprovalingOrderBelongInfosByOrderIdAndBelongType(decorationOrderId, belongType);
		
		if(orderBelongInfoVOs == null || orderBelongInfoVOs.size() == 0){
			orderBelongInfoVOs = queryOrderBelongInfoForCurrentByOrderIdAType(decorationOrderId, belongType);
		}
		
		return orderBelongInfoVOs;
	}
	
	@Override
	public List<OrderBelongInfoVO> queryOrderBelongInfoForCurrentByOrderIdAType(String decorationOrderId,String belongType){
		List<OrderBelongInfoVO> orderBelongInfoVOs = new ArrayList<OrderBelongInfoVO>();
		List<OrderBelongInfoPO> orderBelongInfoPOs =  orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationOrderId, belongType);
		
		for(OrderBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			OrderBelongInfoVO orderBelongInfoVO = new OrderBelongInfoVO();
			
			if(orderBelongInfoPO.getApprovalUserPO() != null){
				orderBelongInfoVO.setApprovalUser(orderBelongInfoPO.getApprovalUserPO().getCurrentName());
				orderBelongInfoVO.setApprovalTime(orderBelongInfoPO.getApprovalTime());
				orderBelongInfoVO.setApprovalUserId(orderBelongInfoPO.getApprovalUserPO().getUserId());
			}
			
			if(orderBelongInfoPO.getOperateUserPO() != null){
				orderBelongInfoVO.setOperateUser(orderBelongInfoPO.getOperateUserPO().getCurrentName());
				orderBelongInfoVO.setOperateUserId(orderBelongInfoPO.getOperateUserPO().getUserId());
				orderBelongInfoVO.setOperateTime(orderBelongInfoPO.getOperateTime());
			}
			
			orderBelongInfoVO.setBelongDept(orderBelongInfoPO.getBelongDeptPO().getDeptName());
			orderBelongInfoVO.setBelongDeptId(orderBelongInfoPO.getBelongDeptPO().getDeptId());
			
			if(orderBelongInfoPO.getBelongRegionPO() != null){
				orderBelongInfoVO.setBelongRegion(orderBelongInfoPO.getBelongRegionPO().getDeptName());
				orderBelongInfoVO.setBelongRegionId(orderBelongInfoPO.getBelongRegionPO().getDeptId());
			}else{
				orderBelongInfoVO.setBelongRegion("");
				orderBelongInfoVO.setBelongRegionId("");
			}
			orderBelongInfoVO.setBelongUser(orderBelongInfoPO.getBelongUserPO().getCurrentName());
			orderBelongInfoVO.setBelongUserId(orderBelongInfoPO.getBelongUserPO().getUserId());
			orderBelongInfoVO.setBelongRate(orderBelongInfoPO.getBelongRate());
			orderBelongInfoVO.setBelongType(orderBelongInfoPO.getBelongType());
			orderBelongInfoVO.setAutoId(orderBelongInfoPO.getAutoId());
			orderBelongInfoVO.setDefaultFlag(orderBelongInfoPO.getDefaultFlag());
			
			orderBelongInfoVOs.add(orderBelongInfoVO);
		}
		
		return orderBelongInfoVOs;
	}
	
}
