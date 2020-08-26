package com.fanglin.communion.service.impl;

import java.util.ArrayList;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.HouseLayoutDao;
import com.fanglin.communion.po.HouseLayoutPO;
import com.fanglin.communion.service.HouseLayoutService;
import com.fanglin.communion.vo.HouseLayoutVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.BeanUtil;

@Service("houseLayoutService")
@Transactional(readOnly = true)
public class HouseLayoutServiceImpl implements HouseLayoutService {

	@Autowired
	private HouseLayoutDao houseLayoutDao;
	
	@Override
	public List<HouseLayoutVO> queryHouseLayout(HouseLayoutVO houseLayoutVO) {
		
		List<HouseLayoutPO> houseLayoutPOs = houseLayoutDao.queryHouseLayout(houseLayoutVO.getVid());
		List<HouseLayoutVO> houseLayoutVOs = new ArrayList<HouseLayoutVO>();
		
		for (HouseLayoutPO houseLayoutPO : houseLayoutPOs) {
			houseLayoutVO = new HouseLayoutVO();
			
			BeanUtil.copyProperties(houseLayoutPO, houseLayoutVO);
			
			houseLayoutVOs.add(houseLayoutVO);
		}
		
		return houseLayoutVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException {
		HouseLayoutPO houseLayoutPO = new HouseLayoutPO();
		
		houseLayoutPO.setName(houseLayoutVO.getName());
		houseLayoutPO.setVid(houseLayoutVO.getVid());
		houseLayoutPO.setArea(houseLayoutVO.getArea());
		houseLayoutPO.setComment(houseLayoutVO.getComment());
		
		houseLayoutDao.save(houseLayoutPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException {

		houseLayoutDao.deleteById(houseLayoutVO.getHlid());
	}

}
