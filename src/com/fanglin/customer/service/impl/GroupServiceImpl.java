package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.GroupDao;
import com.fanglin.customer.po.GroupPO;
import com.fanglin.customer.service.GroupService;
import com.fanglin.customer.vo.GroupVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("groupService")
@Transactional(readOnly=true)
public class GroupServiceImpl implements GroupService{
	
	@Autowired
	private GroupDao groupDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Override
	public void pageGroup(Paging paging, List<Filter> filters) {
		
		List<GroupPO> groupPOs = groupDao.pageGroup(paging, filters);
		
		List<GroupVO> groupVOs = new ArrayList<GroupVO>();
		
		for (GroupPO groupPO : groupPOs) {
			
			GroupVO groupVO = new GroupVO();
			
			BeanUtil.copyPropertie(groupPO, groupVO);
			
			groupVOs.add(groupVO);
			
		}
		
		paging.setData(groupVOs);
	}
 
	@Override
	public GroupVO queryGroup(GroupVO groupVO) {
		
		GroupPO groupPO = groupDao.queryGroup(groupVO.getOpengid());
		
		groupVO = new GroupVO();
		
		if(groupPO == null){
			return groupVO;
		}
		
		BeanUtil.copyPropertie(groupPO, groupVO);
		
		return groupVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateGroup(GroupVO groupVO) throws FLException {
		
		GroupPO groupPO = groupDao.get(groupVO.getGid());
		
		if(groupPO != null){
			
			groupPO.setName(groupVO.getName());
			groupPO.setContent(groupVO.getContent());
			
			groupDao.update(groupPO);
			
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateGroupForCommon(GroupVO groupVO) throws FLException {
		
		GroupPO groupPO = groupDao.queryGroup(groupVO.getOpengid());
		
		if(groupPO == null){
			
			groupPO = new GroupPO();
			
			BeanUtil.copyPropertie(groupVO, groupPO);
			
			groupDao.save(groupPO);
			
		}else{
			
			if(groupVO.getOrderId() != null){
				
				groupPO.setOrderId(groupVO.getOrderId());
				
				groupDao.update(groupPO);
				
			}
			
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int bindGroup(GroupVO groupVO) throws FLException {
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(groupVO.getOrderId());
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		GroupPO groupPO = groupDao.queryGroup(groupVO.getOpengid());
		
		if(groupPO != null){
			
			groupPO.setOrderId(groupVO.getOrderId());
			
			groupDao.update(groupPO);
			
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int unbindGroup(GroupVO groupVO) throws FLException {
		
		GroupPO groupPO = groupDao.get(groupVO.getGid());
		
		if(groupPO != null){
			
			groupPO.setOrderId(null);
			
			groupDao.update(groupPO);
			
		}
		
		return 0;
	}

}
