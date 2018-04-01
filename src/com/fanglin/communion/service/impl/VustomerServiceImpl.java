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
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vustomerService")
@Transactional(readOnly = true)
public class VustomerServiceImpl implements VustomerService {

	@Autowired
	private VustomerDao vustomerDao;

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
	public List<VustomerVO> queryVustomer() {
		
		List<VustomerPO> vustomerPOs = vustomerDao.queryVustomer();
		
		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
		
		for(VustomerPO vustomerPO : vustomerPOs){
			
			VustomerVO vustomerVO = new VustomerVO();
			
			BeanUtil.copyProperties(vustomerPO, vustomerVO);
			
			vustomerVOs.add(vustomerVO);
		}

		return vustomerVOs;
		
	}

	@Override
	public List<VustomerVO> queryVustomerByIdent(VustomerVO vustomerVO) {
		
		List<VustomerPO> vustomerPOs = vustomerDao.queryVustomerByIdent(vustomerVO.getIdent());
		
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
		
		if(vustomerPO == null) throw new FLException(111111, "返单记录不存在");
		
		if(vustomerPO.getOrderId() != null) throw new FLException(111111, "返单已绑定");
		
		vustomerPO.setOrderId(vustomerVO.getOrderId());
		vustomerPO.setContractPrice(vustomerVO.getContractPrice());
		
		vustomerDao.update(vustomerPO);
		
	}

}
