/**
 * @File Name	: ConstructionServiceImpl.java
 * @Package   	: com.fanglin.service.impl.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionRecordDao;
import com.fanglin.construction.dao.QualiterDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionRecordPO;
import com.fanglin.construction.po.QualiterPO;
import com.fanglin.construction.service.ConstructionService;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.construction.vo.QualiterVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserPartnerDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserPartnerPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("constructionService")
@Transactional(readOnly = true)
public class ConstructionServiceImpl implements ConstructionService {

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionRecordDao constructionRecordDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private UserPartnerDao userPartnerDao;

	@Autowired
	private QualiterDao qualiterDao;

	@Override
	public void pageConstruction(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (ConstructionPO constructionPO : constructionPOs) {
			decorationVOs.add(ptv(constructionPO.getDecoration()));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageConstructionForSupervision(Paging paging, List<Filter> filters, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		List<ConstructionPO> constructionSchedulePOs = constructionDao.pageConstructionForSupervision(paging, filters, userPO.getUid());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (ConstructionPO constructionSchedulePO : constructionSchedulePOs) {
			decorationVOs.add(ptv(constructionSchedulePO.getDecoration()));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageConstructionForAcceptance(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (ConstructionPO constructionPO : constructionPOs) {
			decorationVOs.add(ptv(constructionPO.getDecoration()));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageConstructionForBase(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<ConstructionVO> constructionVOs = new ArrayList<ConstructionVO>();

		ConstructionVO constructionVO;

		for (ConstructionPO constructionPO : constructionPOs) {

			constructionVO = new ConstructionVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(constructionPO, constructionVO, Arrays.asList("decoration", "supervisor", "locker"));
			BeanUtil.copyProperties(ptv(constructionPO.getDecoration()), constructionVO.getDecoration());
			BeanUtil.copyProperties(constructionPO.getSupervisor(), constructionVO.getSupervisor(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(constructionPO.getLocker(), constructionVO.getLocker(), Arrays.asList("duty", "dept"));

			constructionVOs.add(constructionVO);
		}

		paging.setData(constructionVOs);
	}

	@Override
	public ConstructionVO queryConstructionById(int cid) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(cid);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		ConstructionVO constructionVO = new ConstructionVO(new UserBaseVO());

		BeanUtil.copyProperties(constructionPO, constructionVO);

		return constructionVO;
	}

	@Override
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		BeanUtil.copyProperties(constructionPO, constructionVO, Arrays.asList("decoration", "supervisor", "locker"));

		constructionVO.setSupervisor(new UserBaseVO());

		constructionVO.setLocker(new UserBaseVO());

		if (constructionPO.getSupervisor() != null) {
			BeanUtil.copyProperties(constructionPO.getSupervisor(), constructionVO.getSupervisor(), Arrays.asList("duty", "dept"));
		}

		if (constructionPO.getLocker() != null) {
			BeanUtil.copyProperties(constructionPO.getLocker(), constructionVO.getLocker(), Arrays.asList("duty", "dept"));
		}

		return constructionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionByOrderId(ConstructionVO constructionVO, List<QualiterVO> qualiters, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(constructionVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionVO.getDecoration() != null && constructionVO.getDecoration().getConpany() != null) {
			decorationPO.setConpany(CompanyServiceImpl.decode(constructionVO.getDecoration().getConpany()));
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		UserPO supervisor = userDao.queryUserByUserId(constructionVO.getSupervisor().getUserId());

		constructionRecordDao.save(new ConstructionRecordPO().init(constructionPO.getDecoration().getOrderId(), constructionPO.getCid(), operater, ConstructionRecordPO.TYPE_COMMON_INT, String.format("更换监理, 原监理: %s(%s), 现监理: %s(%s)", decorationPO.getSupervisor() != null ? decorationPO.getSupervisor().getCurrentName() : "-", decorationPO.getSupervisor() != null ? decorationPO.getSupervisor().getUserId() : "-", supervisor.getCurrentName(), supervisor.getUserId())));

		constructionPO.setSupervisor(supervisor);

		constructionDao.update(constructionPO);

		decorationPO.setSupervisor(supervisor);

		UserPartnerPO partner = userPartnerDao.queryUserPartner(supervisor.getUid(), UserPartnerPO.TYPE_SALES_INT, decorationPO.getCompany());

		if (partner != null) {
			decorationPO.setMaterialer(partner.getPartner());
		}

		decorationDao.update(decorationPO);

		if (qualiters == null || qualiters.size() == 0) return;

		for (QualiterVO qualiter : qualiters) {

			UserPO userPO = userDao.queryUserByUserId(qualiter.getUser().getUserId());

			if (userPO == null) continue;

			QualiterPO qualiterPO = new QualiterPO();

			qualiterPO.setDecoration(decorationPO);
			qualiterPO.setCid(constructionPO.getCid());
			qualiterPO.setUser(userPO);
			qualiterPO.setSchedule(qualiter.getSchedule());
			qualiterPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

			qualiterDao.save(qualiterPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int openAccessory(ConstructionVO constructionVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(constructionVO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionPO.setAccessory(ConstructionPO.ACCESSORY_OPEN_SHORT);

		constructionDao.update(constructionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstructionForAdvance(ConstructionVO constructionVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(constructionVO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionPO.setAccessoryLimit(constructionVO.getAccessoryLimit());
		constructionPO.setSalaryLimit(constructionVO.getSalaryLimit());

		constructionDao.update(constructionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockAccessory(ConstructionVO constructionVO, String userId) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(constructionVO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		UserPO locker = userDao.queryUserByUserId(userId);

		constructionPO.setAccessory(ConstructionPO.ACCESSORY_LOCK_SHORT);

		constructionPO.setLocker(locker);

		constructionPO.setLockTime(DateUtil.getDateToTimestamp(new Date()));

		constructionDao.update(constructionPO);

		return 0;
	}

	private DecorationVO ptv(DecorationPO decorationPO) {

		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setSupervisor(new UserBaseVO());

		decorationPO.ptvcascade(decorationVO);

		return decorationVO;
	}

}
