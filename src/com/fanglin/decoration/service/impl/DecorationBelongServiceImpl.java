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

import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationBelongInfoPO;
import com.fanglin.decoration.service.DecorationBelongService;
import com.fanglin.decoration.vo.DecorationBelongVO;

@Service("orderBelongInfoService")
@Transactional(readOnly=true)
public class DecorationBelongServiceImpl implements DecorationBelongService {

	@Autowired
	private DecorationBelongDao orderBelongInfoDao;
	
	@Override
	public List<DecorationBelongVO> queryApprovalingOrderBelongInfosByOrderIdAndBelongType(String decorationOrderId,String belongType){
		
		List<DecorationBelongVO> orderBelongInfoVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoByOrderIdAType(decorationOrderId, belongType);
		
		if(orderBelongInfoPOs == null) {
			return null;
		}
		
		for(DecorationBelongInfoPO orderBelongInfoPO : orderBelongInfoPOs){
			DecorationBelongVO orderBelongInfoVO = new DecorationBelongVO();
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
	public List<DecorationBelongVO> queryOrderBelongInfoForChangeByOrderIdAType(String decorationOrderId,String belongType){
		
		List<DecorationBelongVO> orderBelongInfoVOs = queryApprovalingOrderBelongInfosByOrderIdAndBelongType(decorationOrderId, belongType);
		
		if(orderBelongInfoVOs == null || orderBelongInfoVOs.size() == 0){
			orderBelongInfoVOs = queryOrderBelongInfoForCurrentByOrderIdAType(decorationOrderId, belongType);
		}
		
		return orderBelongInfoVOs;
	}
	
	@Override
	public List<DecorationBelongVO> queryOrderBelongInfoForCurrentByOrderIdAType(String decorationOrderId,String belongType){
		List<DecorationBelongVO> orderBelongInfoVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongInfoPO> orderBelongInfoPOs =  orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationOrderId, belongType);
		
		for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			DecorationBelongVO orderBelongInfoVO = new DecorationBelongVO();
			
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
	public List<DecorationBelongVO> queryOrderBelongInfoByOrderId(DecorationBelongVO orderBelongInfoVO) {
		
		List<DecorationBelongVO> orderBelongInfoVOs = new ArrayList<DecorationBelongVO>();
		List<DecorationBelongInfoPO> orderBelongInfoPOs =  orderBelongInfoDao.queryOrderBelongInfoByOrderId(orderBelongInfoVO.getOrderId());
		
		for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			DecorationBelongVO _orderBelongInfoVO = new DecorationBelongVO();
			
			if(orderBelongInfoPO.getApprovalUserPO() != null){
				_orderBelongInfoVO.setApprovalUser(orderBelongInfoPO.getApprovalUserPO().getCurrentName());
				_orderBelongInfoVO.setApprovalTime(orderBelongInfoPO.getApprovalTime());
				_orderBelongInfoVO.setApprovalUserId(orderBelongInfoPO.getApprovalUserPO().getUserId());
			}
			
			if(orderBelongInfoPO.getOperateUserPO() != null){
				_orderBelongInfoVO.setOperateUser(orderBelongInfoPO.getOperateUserPO().getCurrentName());
				_orderBelongInfoVO.setOperateUserId(orderBelongInfoPO.getOperateUserPO().getUserId());
				_orderBelongInfoVO.setOperateTime(orderBelongInfoPO.getOperateTime());
			}
			
			_orderBelongInfoVO.setBelongDept(orderBelongInfoPO.getBelongDeptPO().getDeptName());
			_orderBelongInfoVO.setBelongDeptId(orderBelongInfoPO.getBelongDeptPO().getDeptId());
			
			if(orderBelongInfoPO.getBelongRegionPO() != null){
				_orderBelongInfoVO.setBelongRegion(orderBelongInfoPO.getBelongRegionPO().getDeptName());
				_orderBelongInfoVO.setBelongRegionId(orderBelongInfoPO.getBelongRegionPO().getDeptId());
			}else{
				_orderBelongInfoVO.setBelongRegion("");
				_orderBelongInfoVO.setBelongRegionId("");
			}
			_orderBelongInfoVO.setBelongUser(orderBelongInfoPO.getBelongUserPO().getCurrentName());
			_orderBelongInfoVO.setBelongUserId(orderBelongInfoPO.getBelongUserPO().getUserId());
			_orderBelongInfoVO.setBelongRate(orderBelongInfoPO.getBelongRate());
			_orderBelongInfoVO.setBelongType(orderBelongInfoPO.getBelongType());
			_orderBelongInfoVO.setAutoId(orderBelongInfoPO.getAutoId());
			_orderBelongInfoVO.setDefaultFlag(orderBelongInfoPO.getDefaultFlag());
			
			orderBelongInfoVOs.add(_orderBelongInfoVO);
		}
		
		return orderBelongInfoVOs;
	}
	
}
