package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.market.dao.EpictureDao;
import com.fanglin.market.po.EpicturePO;
import com.fanglin.market.service.EpictureService;
import com.fanglin.market.vo.EpictureVO;
import com.fanglin.utils.BeanUtil;

@Service("epictureService")
@Transactional(readOnly = true)
public class EpictureServiceImpl implements EpictureService{

	@Autowired
	private EpictureDao epictureDao;

	@Override
	public List<EpictureVO> queryEpictureByCid(EpictureVO epictureVO) {

		List<EpicturePO> epicturePOs = epictureDao.queryEpictureByCid(epictureVO.getCid(), epictureVO.getType());
		List<EpictureVO> epictureVOs = new ArrayList<EpictureVO>();
		for (EpicturePO epicturePO : epicturePOs) {
			EpictureVO epicture = new EpictureVO();
			BeanUtil.copyProperties(epicturePO,epicture);
			epictureVOs.add(epicture);
		}

		return epictureVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addEpicture(EpictureVO epictureVO) {

		EpicturePO epicturePO = new EpicturePO();

		BeanUtil.copyProperties(epictureVO, epicturePO);

		epictureDao.save(epicturePO);

		epictureVO.setEpid(epicturePO.getEpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteEpicture(EpictureVO epictureVO) {

		this.epictureDao.deleteById(epictureVO.getEpid());

		return 0;
	}

}
