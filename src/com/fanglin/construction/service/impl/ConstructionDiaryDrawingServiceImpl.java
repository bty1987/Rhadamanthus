package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionDiaryDrawingDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionDiaryDrawingPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionDiaryDrawingService;
import com.fanglin.construction.vo.ConstructionDiaryDrawingVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("constructionDiaryDrawingService")
@Transactional(readOnly = true)
public class ConstructionDiaryDrawingServiceImpl implements ConstructionDiaryDrawingService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ConstructionDiaryDrawingDao constructionDiaryDrawingDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ConstructionDiaryDrawingVO> queryConstructionDiaryDrawingByOrderId(ConstructionVO constructionVO, ConstructionDiaryDrawingVO constructionDiaryDrawingVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		Long cdid = constructionPO.getCid();

		List<ConstructionDiaryDrawingPO> constructionDiaryDrawingPOs = constructionDiaryDrawingDao.queryConstructionDiaryDrawingByCdid(cdid);
		List<ConstructionDiaryDrawingVO> constructionDiaryDrawingVOs = new ArrayList<ConstructionDiaryDrawingVO>();

		for (ConstructionDiaryDrawingPO constructionDiaryDrawingPO : constructionDiaryDrawingPOs) {

			ConstructionDiaryDrawingVO _constructionDiaryDrawingVO = new ConstructionDiaryDrawingVO();

			BeanUtil.copyProperties(constructionDiaryDrawingPO, _constructionDiaryDrawingVO, Arrays.asList("creater"));

			constructionDiaryDrawingVOs.add(_constructionDiaryDrawingVO);
		}

		return constructionDiaryDrawingVOs;
	}

	@Override
	public List<ConstructionDiaryDrawingVO> queryConstructionDiaryDrawingByCdid(ConstructionDiaryDrawingVO constructionDiaryDrawingVO) {

		Long cdid = constructionDiaryDrawingVO.getCdid();
		
		List<ConstructionDiaryDrawingPO> constructionDiaryDrawingPOs = constructionDiaryDrawingDao.queryConstructionDiaryDrawingByCdid(cdid);
		List<ConstructionDiaryDrawingVO> constructionDiaryDrawingVOs = new ArrayList<ConstructionDiaryDrawingVO>();

		for (ConstructionDiaryDrawingPO constructionDiaryDrawingPO : constructionDiaryDrawingPOs) {

			ConstructionDiaryDrawingVO _constructionDiaryDrawingVO = new ConstructionDiaryDrawingVO();

			BeanUtil.copyProperties(constructionDiaryDrawingPO, _constructionDiaryDrawingVO, Arrays.asList("creater"));

			constructionDiaryDrawingVOs.add(_constructionDiaryDrawingVO);
		}

		return constructionDiaryDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public long addConstructionDiaryDrawing(ConstructionDiaryDrawingVO constructionDiaryDrawingVO,String userId, int company) throws FLException {

		long cdid = constructionDiaryDrawingVO.getCdid();

		SystemConfigPO constructionDiaryDrawingLimit = systemConfigDao.querySystemConfig("constructionDiarydrawinglimit", company);

		if (constructionDiaryDrawingDao.countConstructionDiaryDrawing(cdid) >= (constructionDiaryDrawingLimit == null ? 5 : Integer.valueOf(constructionDiaryDrawingLimit.getValue()))) {
			throw new FLException(110017, "资源数已达上限");
		}

		ConstructionDiaryDrawingPO constructionDiaryDrawingPO = new ConstructionDiaryDrawingPO();

		BeanUtil.copyProperties(constructionDiaryDrawingVO, constructionDiaryDrawingPO, Arrays.asList("creater"));

		constructionDiaryDrawingPO.setCreater(userDao.queryUserByUserId(userId));
		constructionDiaryDrawingPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		ConstructionSchedulePO constructionSchedulePO = null;

		if (constructionDiaryDrawingVO.getCsid() != null) {
			constructionSchedulePO = constructionScheduleDao.get(constructionDiaryDrawingVO.getCsid());
		}

		if (constructionSchedulePO == null) {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(constructionDiaryDrawingVO.getCid(), constructionDiaryDrawingVO.getSchedule());
		}

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		constructionDiaryDrawingPO.setCsid(constructionSchedulePO.getCsid());
		constructionDiaryDrawingPO.setCnid(constructionSchedulePO.getCnid());

		constructionDiaryDrawingDao.save(constructionDiaryDrawingPO);
		
		return constructionDiaryDrawingPO.getCddid();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructionDiaryDrawingByCddid(ConstructionDiaryDrawingVO constructionDiaryDrawingVO) {

		constructionDiaryDrawingDao.deleteById(constructionDiaryDrawingVO.getCddid());

	}

}
