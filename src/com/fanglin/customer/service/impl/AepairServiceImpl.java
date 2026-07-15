package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.AepairDao;
import com.fanglin.customer.dao.ConsultionDao;
import com.fanglin.customer.dao.RepairDao;
import com.fanglin.customer.po.AepairPO;
import com.fanglin.customer.po.ConsultionPO;
import com.fanglin.customer.po.RepairPO;
import com.fanglin.customer.service.AepairService;
import com.fanglin.customer.vo.AepairVO;
import com.fanglin.customer.vo.ConsultionVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.service.DingTalkMessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("aepairService")
@Transactional(readOnly = true)
public class AepairServiceImpl implements AepairService {

	@Autowired
	private AepairDao aepairDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private RepairDao repairDao;

	@Autowired
	private ConsultionDao consultionDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private DingTalkMessageService messageService;

	@Override
	public void pageAepair(Paging paging, List<Filter> filters, int company) {

		List<AepairPO> aepairPOs = aepairDao.pageAepair(paging, filters, company);
		List<AepairVO> aepairVOs = new ArrayList<AepairVO>();

		for (AepairPO aepairPO : aepairPOs) {

			aepairVOs.add(POtoVO(aepairPO));

		}

		paging.setData(aepairVOs);
	}

	@Override
	public List<AepairVO> queryAepair(AepairVO aepairVO) {

		List<AepairPO> aepairPOs = aepairDao.queryAepair(aepairVO.getCsid());
		List<AepairVO> aepairVOs = new ArrayList<AepairVO>();

		for (AepairPO aepairPO : aepairPOs) {

			aepairVOs.add(POtoVO(aepairPO));

		}

		return aepairVOs;
	}

	@Override
	public List<AepairVO> queryAepairByOrderId(AepairVO aepairVO) {

		List<AepairPO> aepairPOs = aepairDao.queryAepairByOrderId(aepairVO.getDecoration().getOrderId());
		List<AepairVO> aepairVOs = new ArrayList<AepairVO>();

		for (AepairPO aepairPO : aepairPOs) {

			aepairVOs.add(POtoVO(aepairPO));

		}

		return aepairVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAepair(AepairVO aepairVO, ConsultionVO consultionVO, String userId, int company) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		if (consultionVO.getCid() == null) {

			CompanyPO companyPO = companyDao.get(company);

			ConsultionPO consultionPO = new ConsultionPO(null, creater);
			BeanUtil.copyProperties(consultionVO, consultionPO, Arrays.asList("decoration", "creater"));

			String orderId = "";

			if (consultionVO.getDecoration() != null) {
				orderId = consultionVO.getDecoration().getOrderId();
			}

			DecorationPO decorationPO = null;

			if (!orderId.equals("")) {
				decorationPO = decorationDao.queryDecorationByOrderId(orderId);
				if (decorationPO == null) {
					throw new FLException(140013, "装修单不存在");
				}
				consultionPO.setDecoration(decorationPO);
			}

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_COMSULTION_NO_INT, currentDate, company);
			String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			consultionPO.setNo(no);
			consultionPO.setCompany(company);
			consultionPO.setComment(consultionVO.getComment());

			consultionDao.save(consultionPO);

			AepairPO aepairPO = new AepairPO().init(consultionPO.getCid(), decorationPO, creater, aepairVO.getTargetTime(), company, aepairVO.getComment());

			aepairDao.save(aepairPO);

		} else {

			ConsultionPO consultionPO = consultionDao.get(consultionVO.getCid());

			AepairPO aepairPO = new AepairPO().init(consultionVO.getCid(), consultionPO.getDecoration(), creater, aepairVO.getTargetTime(), company, aepairVO.getComment());

			aepairDao.save(aepairPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAepair(AepairVO aepairVO, String userId) throws FLException {

		AepairPO aepairPO = aepairDao.get(aepairVO.getAid());

		if (aepairPO == null) {
			throw new FLException(330021, "报修信息不存在");
		}

		if (aepairPO.getStatus() != AepairPO.STATUS_INIT_INT && aepairPO.getStatus() != AepairPO.STATUS_REPAIR_INT) {
			throw new FLException(330022, "报修状态不可操作");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		aepairPO.setOutlay(aepairVO.getOutlay());
		aepairPO.setUpdater(userPO);
		aepairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		aepairDao.update(aepairPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveAepair(AepairVO aepairVO, String userId) throws FLException {

		AepairPO aepairPO = aepairDao.get(aepairVO.getAid());

		if (aepairPO == null) {
			throw new FLException(330021, "报修信息不存在");
		}

		if (aepairPO.getStatus() != AepairPO.STATUS_INIT_INT) {
			throw new FLException(330022, "报修状态不可操作");
		}

		if (aepairPO.getRepaier() != null) {
			throw new FLException(330027, "维修已有归属");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		aepairPO.setUpdater(userPO);
		aepairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		aepairPO.setRepaier(userPO);
		aepairPO.setStatus(AepairPO.STATUS_REPAIR_INT);

		aepairDao.update(aepairPO);

		RepairPO repairPO = new RepairPO().save(aepairVO.getAid(), userPO);

		repairDao.save(repairPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveAepair(AepairVO aepairVO, String userId) throws FLException {

		AepairPO aepairPO = aepairDao.get(aepairVO.getAid());

		if (aepairPO == null) {
			throw new FLException(330021, "报修信息不存在");
		}

		if (aepairPO.getStatus() != AepairPO.STATUS_INIT_INT) {
			throw new FLException(330022, "报修状态不可操作");
		}

		if (aepairPO.getRepaier() != null) {
			throw new FLException(330027, "维修已有归属");
		}

		UserPO userPO = userDao.queryUserByUserId(aepairVO.getRepaier().getUserId());
		UserPO updater = userDao.queryUserByUserId(userId);

		aepairPO.setUpdater(updater);
		aepairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		aepairPO.setRepaier(userPO);
		aepairPO.setStatus(AepairPO.STATUS_REPAIR_INT);

		aepairDao.update(aepairPO);

		RepairPO repairPO = new RepairPO().save(aepairVO.getAid(), userPO);

		repairDao.save(repairPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranAepair(AepairVO aepairVO, String userId) throws FLException {

		AepairPO aepairPO = aepairDao.get(aepairVO.getAid());

		if (aepairPO == null) {
			throw new FLException(330021, "报修信息不存在");
		}

		if (aepairPO.getStatus() != AepairPO.STATUS_REPAIR_INT) {
			throw new FLException(330022, "报修状态不可操作");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (!userPO.getUserId().equals(aepairPO.getRepaier().getUserId())) {
			throw new FLException(330028, "维修非当前归属");
		}

		UserPO repair = userDao.queryUserByUserId(aepairVO.getRepaier().getUserId());

		UserPO updater = userDao.queryUserByUserId(userId);

		aepairPO.setUpdater(updater);
		aepairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		aepairPO.setRepaier(repair);

		aepairDao.update(aepairPO);

		repairDao.update(new RepairPO(repair));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishAepair(AepairVO aepairVO, String userId) throws FLException {

		AepairPO aepairPO = aepairDao.get(aepairVO.getAid());

		if (aepairPO == null) {
			throw new FLException(330021, "报修信息不存在");
		}

		if (aepairPO.getStatus() != AepairPO.STATUS_REPAIR_INT) {
			throw new FLException(330022, "报修状态不可操作");
		}

		UserPO updater = userDao.queryUserByUserId(userId);

		aepairPO.setUpdater(updater);
		aepairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		aepairPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		aepairPO.setStatus(AepairPO.STATUS_FINISH_INT);

		aepairDao.update(aepairPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int closeAepair(AepairVO aepairVO, String userId) throws FLException {

		AepairPO aepairPO = aepairDao.get(aepairVO.getAid());

		if (aepairPO == null) {
			throw new FLException(330021, "报修信息不存在");
		}

		if (aepairPO.getStatus() != AepairPO.STATUS_FINISH_INT) {
			throw new FLException(330022, "报修状态不可操作");
		}

		UserPO updater = userDao.queryUserByUserId(userId);

		aepairPO.setUpdater(updater);
		aepairPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		aepairPO.setStatus(AepairPO.STATUS_CLOSE_INT);

		aepairDao.update(aepairPO);

		return 0;
	}

	public AepairVO POtoVO(AepairPO aepairPO) {

		AepairVO aepairVO = new AepairVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyProperties(aepairPO, aepairVO, Arrays.asList("decoration", "creater", "updater", "repaier"));

		if (aepairPO.getDecoration() != null) {
			aepairPO.getDecoration().ptvcascade(aepairVO.getDecoration());
		}

		aepairVO.getCreater().setBaseInfo(aepairPO.getCreater());
		aepairVO.getUpdater().setBaseInfo(aepairPO.getUpdater());
		aepairVO.getRepaier().setBaseInfo(aepairPO.getRepaier());

		return aepairVO;
	}

	@Override
	public int sendAepair(String code, AepairVO aepairVO) {

		AepairPO aepairPO = aepairDao.get(aepairVO.getAid());

		String message = String.format("订单号:%s,创建人:%s,说明:%s", aepairPO.getDecoration().getOrderId(), aepairPO.getCreater().getCurrentName(), aepairPO.getComment());

		messageService.sendLink(code, "测试", message, "jump", aepairPO.getCompany(), aepairPO.getAid(), aepairPO.getCreater().getCurrentName(), aepairPO.getCreateTime(), aepairPO.getComment());

		return 0;
	}

}
