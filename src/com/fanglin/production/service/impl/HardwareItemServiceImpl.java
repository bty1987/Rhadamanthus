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
import com.fanglin.production.service.HardwareItemService;
import com.fanglin.production.vo.HardwareItemVO;
import com.fanglin.production.vo.HardwareVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("hardwareItemService")
@Transactional(readOnly = true)
public class HardwareItemServiceImpl implements HardwareItemService {

	@Autowired
	private HardwareItemDao hardwareItemDao;

	@Autowired
	private HardwareDao hardwareDao;

	@Override
	public void pageHardwareItemByHid(Paging paging, List<Filter> filters, HardwareVO hardwareVO) {

		List<HardwareItemPO> hardwareItemPOs = hardwareItemDao.pageHardwareItemByHid(paging, filters, hardwareVO.getHid());
		List<HardwareItemVO> hardwareItemVOs = new ArrayList<HardwareItemVO>();

		HardwareItemVO hardwareItemVO;

		for (HardwareItemPO hardwareItemPO : hardwareItemPOs) {

			hardwareItemVO = new HardwareItemVO();

			BeanUtil.copyProperties(hardwareItemPO, hardwareItemVO);

			hardwareItemVOs.add(hardwareItemVO);
		}

		paging.setData(hardwareItemVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addHardwareItem(List<HardwareItemVO> hardwareItemVOs, HardwareVO HardwareVO) throws FLException {

		HardwarePO hardwarePO = hardwareDao.get(HardwareVO.getHid());

		if (hardwarePO == null) {
			throw new FLException(220004, "五金单不存在");
		}

		HardwareItemPO hardwareItemPO;

		for (HardwareItemVO hardwareItemVO : hardwareItemVOs) {

			hardwareItemPO = new HardwareItemPO();

			BeanUtil.copyProperties(hardwareItemVO, hardwareItemPO);
			hardwareItemPO.setHid(HardwareVO.getHid());

			hardwareItemDao.save(hardwareItemPO);

		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteHardwareItem(HardwareItemVO hardwareItemVO) throws FLException {

		HardwareItemPO hardwareItemPO = hardwareItemDao.get(hardwareItemVO.getHiid());

		if (hardwareItemPO == null) {
			throw new FLException(220031, "五金项不存在");
		}

		hardwareItemDao.delete(hardwareItemPO);

		return 0;
	}

}
