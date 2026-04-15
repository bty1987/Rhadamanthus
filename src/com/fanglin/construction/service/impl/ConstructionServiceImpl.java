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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CityProperPartnerDao;
import com.fanglin.communion.dao.DepartmentPartnerDao;
import com.fanglin.communion.po.CityProperPartnerPO;
import com.fanglin.communion.po.DepartmentPartnerPO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.ConstructionRecordDao;
import com.fanglin.construction.dao.QualiterDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionRecordPO;
import com.fanglin.construction.po.QualiterPO;
import com.fanglin.construction.service.ConstructionService;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.construction.vo.QualiterVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.dao.UserPartnerDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.po.UserPartnerPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("constructionService")
@Transactional(readOnly = true)
public class ConstructionServiceImpl implements ConstructionService {

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private ConstructionRecordDao constructionRecordDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationUserDao decorationUserDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private UserPartnerDao userPartnerDao;

	@Autowired
	private DepartmentPartnerDao departmentPartnerDao;

	@Autowired
	private CityProperPartnerDao cityProperPartnerDao;

	@Autowired
	private QualiterDao qualiterDao;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Override
	public void pageConstruction(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (ConstructionPO constructionPO : constructionPOs) {
			decorationVOs.add(constructionPO.getDecoration().ptvcascade(new DecorationVO(new UserBaseVO())));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageConstructionForSupervision(Paging paging, List<Filter> filters, String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		List<ConstructionPO> constructionPOs = constructionDao.pageConstructionForSupervision(paging, filters, userPO.getUid());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (ConstructionPO constructionPO : constructionPOs) {
			decorationVOs.add(constructionPO.getDecoration().ptvcascade(new DecorationVO(new UserBaseVO())));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageConstructionForAcceptance(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (ConstructionPO constructionPO : constructionPOs) {
			decorationVOs.add(constructionPO.getDecoration().ptvcascade(new DecorationVO(new UserBaseVO())));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageConstructionForBase(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<ConstructionVO> constructionVOs = new ArrayList<ConstructionVO>();

		for (ConstructionPO constructionPO : constructionPOs) {
			constructionVOs.add(constructionPO.ptv(new ConstructionVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(constructionVOs);
	}

	@Override
	public ConstructionVO queryConstructionById(int cid) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(cid);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		return constructionPO.ptv(new ConstructionVO(new UserBaseVO()));
	}

	@Override
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		return constructionPO.ptv(new ConstructionVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO()));
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

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(decorationPO.getOrderId());

		if (constructionInfoPO == null) {
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

		constructionInfoPO.setIsIssue(ConstructionInfoPO.ISISSUE_ISSUE_INT);
		constructionInfoPO.setIssueTime(DateUtil.getDateToTimestamp(new Date()));

		constructionInfoDao.update(constructionInfoPO);

		UserPartnerPO partnerPO = userPartnerDao.queryUserPartner(supervisor.getUid(), UserPartnerPO.TYPE_SERV_INT, decorationPO.getCompany());

		if (partnerPO != null) {
			decorationPO.setMaterialer(partnerPO.getPartner());
		} else {
			DepartmentPartnerPO partnerDO = departmentPartnerDao.queryDepartmentPartner(decorationPO.getDesigner().getDept().getDid(), DepartmentPartnerPO.TYPE_SERV_INT);

			if (partnerDO != null) decorationPO.setMaterialer(partnerDO.getPartner());
		}

		decorationDao.update(decorationPO);

		// 生成消息队列数据: 监理更换事件
		String orderId = decorationPO.getOrderId();
		String busiTypeName = decorationPO.getBusitype() != null ? decorationPO.getBusitype().getName() : "-";

		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "updateConstruction", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"TEAM_SUPERVISOR_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + busiTypeName + "\"" : "") + "}"));

		DepartmentPartnerPO partnerSO = departmentPartnerDao.queryDepartmentPartner(decorationPO.getDesigner().getDept().getDid(), DepartmentPartnerPO.TYPE_SALES_INT);

		if (partnerSO != null) {

			DecorationUserPO decorationUserPO = new DecorationUserPO();

			decorationUserPO.setOrderId(decorationPO.getOrderId());
			decorationUserPO.setUser(partnerSO.getPartner());
			decorationUserPO.setType(DecorationUserPO.TYPE_SALES_INT);

			decorationUserDao.save(decorationUserPO);
		}

		CityProperPartnerPO partnerCPO = cityProperPartnerDao.queryCityProperPartner(decorationPO.getHouse().getVillage().getCityProper().getCpid(), CityProperPartnerPO.TYPE_SERV_INT);

		if (partnerCPO != null) {

			DecorationUserPO decorationUserPO = new DecorationUserPO();

			decorationUserPO.setOrderId(decorationPO.getOrderId());
			decorationUserPO.setType(DecorationUserPO.TYPE_SERV_INT);
			decorationUserPO.setUser(partnerCPO.getPartner());

			decorationUserDao.save(decorationUserPO);
		}

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
	public int updateConstructionByCid(ConstructionVO constructionVO) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(constructionVO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionPO.setTerminalStatus(constructionVO.getTerminalStatus());

		constructionDao.update(constructionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int openConstruction(ConstructionVO constructionVO) throws FLException {

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
	public int updateConstructionForAdvance(ConstructionVO constructionVO, String userId) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(constructionVO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionPO.setAccessoryLimit(constructionVO.getAccessoryLimit());
		constructionPO.setSalaryLimit(constructionVO.getSalaryLimit());

		constructionDao.update(constructionPO);

		UserPO operater = userDao.queryUserByUserId(userId);

		constructionRecordDao.save(new ConstructionRecordPO().init(constructionPO.getDecoration().getOrderId(), constructionPO.getCid(), operater, ConstructionRecordPO.TYPE_COMMON_INT, String.format("辅料上限: %s, 工费浮动: %s", constructionPO.getAccessoryLimit(), constructionPO.getSalaryLimit())));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockConstruction(ConstructionVO constructionVO, String userId) throws FLException {

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceConstruction(ConstructionVO constructionVO, String userId) throws FLException {

		ConstructionPO constructionPO = constructionDao.get(constructionVO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		UserPO balancer = userDao.queryUserByUserId(userId);

		constructionPO.setBalanceStatus(ConstructionPO.BALANCE_STATUS_BALANCE_INT);
		constructionPO.setBalancer(balancer);
		constructionPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));

		constructionDao.update(constructionPO);

		return 0;
	}

}
