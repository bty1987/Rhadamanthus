package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.VustomerDao;
import com.fanglin.communion.po.VustomerPO;
import com.fanglin.communion.service.VustomerService;
import com.fanglin.communion.vo.VustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vustomerService")
@Transactional(readOnly = true)
public class VustomerServiceImpl implements VustomerService {

	@Autowired
	private VustomerDao vustomerDao;
	
	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageVustomer(Paging paging, List<Filter> filters) {

		List<VustomerPO> vustomerPOs = vustomerDao.pageVustomer(paging, filters);

		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
			
		for (VustomerPO vustomerPO : vustomerPOs){
			
			VustomerVO vustomerVO = new VustomerVO();
			
			BeanUtil.copyProperties(vustomerPO, vustomerVO);
			
			vustomerVOs.add(vustomerVO);
			
		}
		
		paging.setData(vustomerVOs);

	}
	
	@Override
	public void pageVustomerByUnionId(Paging paging, List<Filter> filters, String unionId) {

		List<VustomerPO> vustomerPOs = vustomerDao.pageVustomerByUnionId(paging, filters, unionId);

		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
			
		for (VustomerPO vustomerPO : vustomerPOs){
			
			VustomerVO vustomerVO = new VustomerVO();
			
			BeanUtil.copyProperties(vustomerPO, vustomerVO);
			
			vustomerVOs.add(vustomerVO);
			
		}
		
		paging.setData(vustomerVOs);
	}

	@Override
	public List<VustomerVO> queryVustomerByUnionId(VustomerVO vustomerVO) {
		
		List<VustomerPO> vustomerPOs = vustomerDao.queryVustomerByUnionId(vustomerVO.getUnionId());
		
		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
		
		for(VustomerPO vustomerPO : vustomerPOs){
			
			vustomerVO = new VustomerVO();
			
			BeanUtil.copyProperties(vustomerPO, vustomerVO);
			
			vustomerVOs.add(vustomerVO);
			
		}
		
		return vustomerVOs;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addVustomer(VustomerVO vustomerVO) {
		
		VustomerPO vustomerPO = new VustomerPO();
		
		BeanUtil.copyProperties(vustomerVO, vustomerPO);
		vustomerPO.setStatus(VustomerPO.STATUS_INIT_INT);
		
		vustomerDao.save(vustomerPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateVustomer(VustomerVO vustomerVO) throws FLException {
		
		VustomerPO vustomerPO = vustomerDao.get(vustomerVO.getVid());
		
		if(vustomerPO == null) throw new FLException(330003, "客户信息不存在");
		
		if(vustomerPO.getOrderId() != null) throw new FLException(330004, "客户已绑装修单");
		
		String orderId = vustomerVO.getOrderId();
		
		List<VustomerPO> vustomers = vustomerDao.queryVustomer();
		List<String> orderIds = new ArrayList<String>();
		
		for (VustomerPO vustomer : vustomers) {
			orderIds.add(vustomer.getOrderId());
		}
		
		if(orderIds.contains(orderId)) throw new FLException(330005, "装修单已被绑定");
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null) throw new FLException(140013, "订单不存在");
		
		if(decorationPO.getOrderTotalPrice() == 0) throw new FLException(330006, "装修单未签约");
		
		vustomerPO.setOrderId(orderId);
		
		vustomerPO.setContractPrice(decorationPO.getOrderTotalPrice());
		
		vustomerDao.update(vustomerPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteVustomer(VustomerVO vustomerVO) {
		
		VustomerPO vustomerPO = vustomerDao.get(vustomerVO.getVid());
		
		vustomerPO.setStatus(VustomerPO.STATUS_DISABLE_INT);
		
		vustomerDao.update(vustomerPO);
		
	}

	@Override
	public List<?> countVustomerByUnionId(VustomerVO vustomerVO) {
	
		 List<?> count = vustomerDao.countVustomerByUnionId(vustomerVO.getUnionId());
		 
		return count;
	}



}
