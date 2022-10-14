package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionDrawingDao;
import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.ConstructionDrawingService;
import com.fanglin.construction.vo.ConstructionDrawingVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("constructionDrawingService")
@Transactional(readOnly = true)
public class ConstructionDrawingServiceImpl implements ConstructionDrawingService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ConstructionDrawingDao constructionDrawingDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ConstructionDrawingVO> queryConstructionDrawingByOrderId(ConstructionVO constructionVO, ConstructionDrawingVO constructionDrawingVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		Long cid = constructionPO.getCid();

		Short schedule = null;

		if (constructionDrawingVO != null) {
			schedule = constructionDrawingVO.getSchedule();
		}

		List<ConstructionDrawingPO> constructionDrawingPOs = constructionDrawingDao.queryConstructionDrawingByCid(cid, schedule);
		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();

		for (ConstructionDrawingPO constructionDrawingPO : constructionDrawingPOs) {

			ConstructionDrawingVO _constructionDrawingVO = new ConstructionDrawingVO();

			BeanUtil.copyProperties(constructionDrawingPO, _constructionDrawingVO, Arrays.asList("creater"));

			constructionDrawingVOs.add(_constructionDrawingVO);
		}

		return constructionDrawingVOs;
	}

	@Override
	public List<ConstructionDrawingVO> queryConstructionDrawingByCid(ConstructionDrawingVO constructionDrawingVO) {

		Long cid = constructionDrawingVO.getCid();
		Short schedule = constructionDrawingVO.getSchedule();

		List<ConstructionDrawingPO> constructionDrawingPOs = constructionDrawingDao.queryConstructionDrawingByCid(cid, schedule);
		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();

		for (ConstructionDrawingPO constructionDrawingPO : constructionDrawingPOs) {

			ConstructionDrawingVO _constructionDrawingVO = new ConstructionDrawingVO();

			BeanUtil.copyProperties(constructionDrawingPO, _constructionDrawingVO, Arrays.asList("creater"));

			constructionDrawingVOs.add(_constructionDrawingVO);
		}

		return constructionDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstructionDrawing(ConstructionDrawingVO constructionDrawingVO, String userId, int company) throws FLException {

		long cid = constructionDrawingVO.getCid();
		short type = constructionDrawingVO.getType();

		SystemConfigPO constructionDrawingLimit = systemConfigDao.querySystemConfig("constructiondrawinglimit", company);

		if (constructionDrawingDao.countConstructionDrawing(cid, type) >= (constructionDrawingLimit == null ? 5 : Integer.valueOf(constructionDrawingLimit.getValue()))) {
			throw new FLException(110017, "资源数已达上限");
		}

		ConstructionDrawingPO constructionDrawingPO = new ConstructionDrawingPO();

		BeanUtil.copyProperties(constructionDrawingVO, constructionDrawingPO, Arrays.asList("creater"));

		constructionDrawingPO.setCreater(userDao.queryUserByUserId(userId));
		constructionDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		constructionDrawingDao.saveOrUpdate(constructionDrawingPO);

		constructionDrawingVO.setCdId(constructionDrawingPO.getCdId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<ConstructionDrawingVO> addConstructionDrawings(List<ConstructionDrawingVO> constructionDrawings, String userId) {

		List<ConstructionDrawingVO> constructionDrawingVOs = new ArrayList<ConstructionDrawingVO>();

		UserPO creater = userDao.queryUserByUserId(userId);

		for (ConstructionDrawingVO constructionDrawing : constructionDrawings) {

			ConstructionDrawingPO constructionDrawingPO = new ConstructionDrawingPO();

			BeanUtil.copyProperties(constructionDrawing, constructionDrawingPO, Arrays.asList("creater"));
			// 新添加的创建人和创建时间
			constructionDrawingPO.setCreater(creater);
			constructionDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

			constructionDrawingDao.save(constructionDrawingPO);

			ConstructionDrawingVO _constructionDrawingVO = new ConstructionDrawingVO();
			BeanUtil.copyProperties(constructionDrawingPO, _constructionDrawingVO, Arrays.asList("creater"));

			constructionDrawingVOs.add(_constructionDrawingVO);
		}

		return constructionDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructionDrawingByCdId(ConstructionDrawingVO constructionDrawingVO) {

		constructionDrawingDao.deleteById(constructionDrawingVO.getCdId());

	}

}
