package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.HouseLayoutDao;
import com.fanglin.communion.po.HouseLayoutPO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.service.HouseLayoutService;
import com.fanglin.communion.vo.HouseLayoutVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("houseLayoutService")
@Transactional(readOnly = true)
public class HouseLayoutServiceImpl implements HouseLayoutService {

	@Autowired
	private HouseLayoutDao houseLayoutDao;

	@Override
	public void pageHouseLayout(Paging paging, List<Filter> filters) {

		List<HouseLayoutPO> houseLayoutPOs = houseLayoutDao.pageHouseLayout(paging, filters);
		List<HouseLayoutVO> houseLayoutVOs = new ArrayList<HouseLayoutVO>();

		for (HouseLayoutPO houseLayoutPO : houseLayoutPOs) {

			HouseLayoutVO houseLayoutVO = new HouseLayoutVO(new VillageVO());

			BeanUtil.copyProperties(houseLayoutPO, houseLayoutVO, Arrays.asList("village"));
			BeanUtil.copyProperties(houseLayoutPO.getVillage(), houseLayoutVO.getVillage(), Arrays.asList("cityProper"));

			houseLayoutVOs.add(houseLayoutVO);
		}
	}

	@Override
	public List<HouseLayoutVO> queryHouseLayout(HouseLayoutVO houseLayoutVO) {

		List<HouseLayoutPO> houseLayoutPOs = houseLayoutDao.queryHouseLayout(houseLayoutVO.getVillage().getVid());
		List<HouseLayoutVO> houseLayoutVOs = new ArrayList<HouseLayoutVO>();

		for (HouseLayoutPO houseLayoutPO : houseLayoutPOs) {

			houseLayoutVO = new HouseLayoutVO(new VillageVO());

			BeanUtil.copyProperties(houseLayoutPO, houseLayoutVO, Arrays.asList("village"));
			BeanUtil.copyProperties(houseLayoutPO.getVillage(), houseLayoutVO.getVillage(), Arrays.asList("cityProper"));

			houseLayoutVOs.add(houseLayoutVO);
		}

		return houseLayoutVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException {

		HouseLayoutPO houseLayoutPO = new HouseLayoutPO();

		BeanUtil.copyProperties(houseLayoutVO, houseLayoutPO, Arrays.asList("village"));

		houseLayoutPO.setVillage(new VillagePO(houseLayoutVO.getVillage().getNo()));

		houseLayoutDao.save(houseLayoutPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteHouseLayout(HouseLayoutVO houseLayoutVO) throws FLException {

		houseLayoutDao.deleteById(houseLayoutVO.getHlid());
	}

}
