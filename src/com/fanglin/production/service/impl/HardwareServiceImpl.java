package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.HardwareDao;
import com.fanglin.production.dao.HardwareItemDao;
import com.fanglin.production.po.HardwareItemPO;
import com.fanglin.production.po.HardwarePO;
import com.fanglin.production.service.HardwareService;

import com.fanglin.production.vo.HardwareVO;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("hardwareService")
@Transactional(readOnly = true)
public class HardwareServiceImpl implements HardwareService{

	@Autowired
	private HardwareDao hardwareDao;
	
	@Autowired
	private HardwareItemDao hardwareItemDao;
	
	@Override
	public void pageHardware(Paging paging, List<Filter> filters ,ProductionVO productionVO) {
		
		List<HardwarePO> hardwarePOs = hardwareDao.pageHardware(paging, filters, productionVO.getPid());
		List<HardwareVO> hardwareVOs = new ArrayList<HardwareVO>();
		
		HardwareVO hardwareVO;
		
		for(HardwarePO hardwarePO: hardwarePOs){
			
			hardwareVO = new HardwareVO();
			
			BeanUtil.copyProperties(hardwarePO, hardwareVO);
			
			hardwareVOs.add(hardwareVO);
		}
		
		paging.setData(hardwareVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addHardware(HardwareVO hardwareVO) throws FLException {
		
		HardwarePO hardwarePO = new HardwarePO();
		
		BeanUtil.copyPropertie(hardwareVO, hardwarePO);
		hardwarePO.setStatus(HardwarePO.STATUS_NOTARRIVAL_SHORT);
		
		hardwareDao.save(hardwarePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateHardware(HardwareVO hardwareVO) throws FLException {
		
		HardwarePO hardwarePO = hardwareDao.get(hardwareVO.getHid());
		
		if(hardwarePO == null){
			throw new FLException(220004 ,"五金单不存在");
		}
		
		if(hardwareVO.getComment() != null){
			hardwarePO.setComment(hardwareVO.getComment());
		}
		
		if(hardwareVO.getPath() != null){
			hardwarePO.setPath(hardwareVO.getPath());
		}
		
		hardwareDao.update(hardwarePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateHardwareForStatus(HardwareVO hardwareVO) throws FLException {
		
		HardwarePO hardwarePO = hardwareDao.get(hardwareVO.getHid());
		
		if(hardwarePO == null){
			throw new FLException(220004 , "五金单不存在");
		}
		
		hardwarePO.setStatus(hardwareVO.getStatus());
		
		hardwareDao.update(hardwarePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteHardware(HardwareVO hardwareVO) throws FLException {
		
		HardwarePO hardwarePO = hardwareDao.get(hardwareVO.getHid());
		
		if(hardwarePO == null){
			throw new FLException(220004 ,"五金单不存在");
		}
		
		List<HardwareItemPO> hardwareItemPOs = hardwareItemDao.queryHardwareItemByHid(hardwareVO.getHid());
		
		for (HardwareItemPO hardwareItemPO : hardwareItemPOs) {
		
			hardwareItemDao.delete(hardwareItemPO);
		}		
		
		hardwareDao.delete(hardwarePO);
		
		return 0;
	}

	


}
