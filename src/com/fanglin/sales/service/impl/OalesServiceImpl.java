package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.dao.OalesPayDao;
import com.fanglin.sales.po.OalesBO;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.sales.po.OalesRecordPO;
import com.fanglin.sales.service.OalesRecordService;
import com.fanglin.sales.service.OalesService;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("oalesService")
@Transactional(readOnly = true)
public class OalesServiceImpl implements OalesService {

	@Autowired
	private OalesDao oalesDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private OalesPayDao oalesPayDao;

	@Autowired
	private OalesRecordService oalesRecordService;

	@Override
	public void pageOales(Paging paging, List<Filter> filters, int company, List<Short> statuses) throws FLException {

		List<OalesPO> oalesPOs = oalesDao.pageOales(paging, filters, statuses, company);
		List<OalesVO> oalesVOs = new ArrayList<OalesVO>();

		for (OalesPO oalesPO : oalesPOs) {
			oalesVOs.add(oalesPO.ptv(new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(oalesVOs);
	}

	@Override
	public void pageOalesForAccount(Paging paging, List<Filter> filters, int company) throws FLException {

		List<OalesPO> oalesPOs = oalesDao.pageOalesForAccount(paging, filters, company);

		List<OalesVO> oalesVOs = new ArrayList<OalesVO>();

		for (OalesPO oalesPO : oalesPOs) {
			oalesVOs.add(oalesPO.ptv(new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(oalesVOs);
	}

	@Override
	public List<OalesVO> queryOalesByOrderId(OalesVO oalesVO) {

		List<OalesBO> oalesBOs = oalesDao.queryOalesByOrderId(oalesVO.getDecoration().getOrderId());
		List<OalesVO> oalesVOs = new ArrayList<OalesVO>();

		for (OalesBO oalesBO : oalesBOs) {

			oalesVO = new OalesVO(null, new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			oalesVO.setBranding(new BrandVO());

			oalesVOs.add(oalesBO.ptv(oalesVO));
		}

		return oalesVOs;
	}

	@Override
	public long amountOales(OalesVO oales) throws FLException {

		Long amount = oalesDao.amountOales(oales.getDecoration().getOrderId(), oales.getIsScale());

		return amount;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOales(OalesVO oalesVO, String userId, int company) throws FLException {

		if (oalesVO.getDecoration() == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(oalesVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		CompanyPO companyPO = companyDao.get(company);

		UserPO creater = userDao.queryUserByUserId(userId);
		UserPO servicer = userDao.queryUserByUserId(oalesVO.getServicer().getUserId());

		UserPO channer = userDao.queryUserByUserId(oalesVO.getChanner().getUserId());

		BrandPO brandPO = brandDao.get(oalesVO.getBid());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_OALES_INT, currentDate, company);
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		OalesPO oalesPO = new OalesPO();

		BeanUtil.copyProperties(oalesVO, oalesPO, Arrays.asList("decoration", "channer", "dept", "region", "house", "customer", "supplier", "creater", "servicer", "checker", "materialer"));

		oalesPO.setNo(no);
		oalesPO.setCompany(company);

		oalesPO.setCreater(creater);
		oalesPO.setServicer(servicer);
		oalesPO.setChanner(channer);
		oalesPO.setDept(channer.getDept());
		oalesPO.setRegion(channer.getDept().getFatherDept());
		oalesPO.setSupplier(brandPO.getSupplier());

		oalesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		oalesPO.setCategory(brandPO.getCategory().getName());
		oalesPO.setBrand(brandPO.getName());

		oalesPO.setDecoration(decorationPO);
		oalesPO.setCustomer(decorationPO.getCustomer());
		oalesPO.setHouse(decorationPO.getHouse());
		oalesDao.save(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_ADD, userId, "新增外销单");
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateOales(OalesVO oalesVO, String userId) throws FLException {

		if (oalesVO.getDecoration() == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(oalesVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		oalesPO.setDecoration(decorationPO);

		if (oalesVO.getServicer() != null) {
			UserPO servicer = userDao.queryUserByUserId(oalesVO.getServicer().getUserId());
			oalesPO.setServicer(servicer);
		}

		if (oalesVO.getMaterialer() != null) {
			UserPO materialer = userDao.queryUserByUserId(oalesVO.getMaterialer().getUserId());
			oalesPO.setMaterialer(materialer);
		}

		if (oalesVO.getChanner() != null) {

			UserPO channer = userDao.queryUserByUserId(oalesVO.getChanner().getUserId());

			oalesPO.setChanner(channer);
			oalesPO.setDept(channer.getDept());
			oalesPO.setRegion(channer.getDept().getFatherDept());
		}

		BeanUtil.copyProperties(oalesVO, oalesPO, Arrays.asList("decoration", "channer", "dept", "region", "supplier", "creater", "servicer", "checker", "materialer"));

		oalesDao.update(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_UPDATE, userId, "更新外销单");
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void submitOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPO.getStatus() != OalesPO.STATUS_INIT_INT) {
			throw new FLException(370022, "外销单状态不可操作");
		}

		short beforeStatus = oalesPO.getStatus();
		oalesPO.setStatus(OalesPO.STATUS_SUBMIT_INI);

		oalesDao.update(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_SUBMIT, userId, "提交外销单", beforeStatus, oalesPO.getStatus());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (!(oalesPO.getStatus() == OalesPO.STATUS_SUBMIT_INI || oalesPO.getStatus() == OalesPO.STATUS_REJECT_INT)) {
			throw new FLException(370022, "外销单状态不可操作");
		}

		short beforeStatus = oalesPO.getStatus();
		oalesPO.setStatus(OalesPO.STATUS_INIT_INT);

		oalesDao.update(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_CANCEL, userId, "取消外销单", beforeStatus, oalesPO.getStatus());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPayDao.countOalesPayByOid(oalesVO.getOid()) == 0) {
			throw new FLException(37002, "外销付款不存在");
		}

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPO.getStatus() != OalesPO.STATUS_SUBMIT_INI && oalesPO.getStatus() != OalesPO.STATUS_REJECT_INT) {
			throw new FLException(370022, "外销单状态不可操作");
		}

		short beforeStatus = oalesPO.getStatus();
		oalesPO.setStatus(OalesPO.STATUS_CONFIRM_INI);
		oalesPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

		oalesDao.update(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_CONFIRM, userId, "确认外销单", beforeStatus, oalesPO.getStatus());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void rejectOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPO.getStatus() != OalesPO.STATUS_CONFIRM_INI) {
			throw new FLException(370022, "外销单状态不可操作");
		}

		UserPO checker = userDao.queryUserByUserId(userId);

		short beforeStatus = oalesPO.getStatus();
		oalesPO.setStatus(OalesPO.STATUS_REJECT_INT);
		oalesPO.setChecker(checker);

		oalesDao.update(oalesPO);

		// 添加操作记录
		String comment = oalesVO.getComment() != null ? oalesVO.getComment() : "驳回外销单";
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_REJECT, userId, comment, beforeStatus, oalesPO.getStatus());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkOales(List<OalesVO> oaleses, String userId) throws FLException {

		for (OalesVO oalesVO : oaleses) {

			OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

			if (oalesPO == null) {
				continue;
			}

			if (oalesPO.getStatus() != OalesPO.STATUS_CONFIRM_INI) {
				continue;
			}

			short beforeStatus = oalesPO.getStatus();
			oalesPO.setStatus(OalesPO.STATUS_CHECK_INT);

			oalesPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

			oalesDao.update(oalesPO);

			// 添加操作记录
			oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_CHECK, userId, "复核外销单", beforeStatus, oalesPO.getStatus());
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPO.getStatus() != OalesPO.STATUS_CHECK_INT) {
			throw new FLException(370022, "外销单状态不可操作");
		}

		short beforeStatus = oalesPO.getStatus();
		oalesPO.setStatus(OalesPO.STATUS_FINISH_INI);
		oalesPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		oalesDao.update(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_FINISH, userId, "完结外销单", beforeStatus, oalesPO.getStatus());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void abateOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		short beforeStatus = oalesPO.getStatus();
		oalesPO.setStatus(OalesPO.STATUS_INVALID_INI);

		oalesDao.update(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_ABATE, userId, "废单", beforeStatus, oalesPO.getStatus());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refundOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPO.getStatus() != OalesPO.STATUS_CHECK_INT) {
			throw new FLException(370022, "外销单状态不可操作");
		}

		CompanyPO companyPO = companyDao.get(oalesPO.getCompany());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_OALES_INT, currentDate, oalesPO.getCompany());
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		UserPO creater = userDao.queryUserByUserId(userId);

		OalesPO oalesRO = new OalesPO();

		BeanUtil.copyProperties(oalesPO, oalesRO, Arrays.asList("decoration", "channer", "dept", "region", "supplier", "creater", "servicer", "checker", "materialer", "threshold", "confirmTime", "checkTime"));

		oalesRO.setNo(no);
		oalesRO.setFoid(oalesPO.getOid());

		oalesRO.setSupplier(oalesPO.getSupplier());
		oalesRO.setChanner(oalesPO.getChanner());
		oalesRO.setDept(oalesPO.getChanner().getDept());
		oalesRO.setRegion(oalesPO.getChanner().getDept().getFatherDept());
		oalesRO.setMaterialer(oalesPO.getMaterialer());
		oalesRO.setServicer(oalesPO.getServicer());
		oalesRO.setDecoration(oalesPO.getDecoration());
		oalesRO.setCreater(creater);

		oalesRO.setTotal(oalesVO.getTotal());
		oalesRO.setCost(oalesVO.getCost());
		oalesRO.setProfit(oalesVO.getProfit());
		oalesRO.setAward(oalesVO.getAward());

		oalesRO.setStatus(OalesPO.STATUS_CONFIRM_INI);
		oalesRO.setType(OalesPO.TYPE_REFUND_INT);
		oalesRO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		oalesDao.save(oalesRO);

		// 添加操作记录（原外销单）
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_REFUND, userId, "创建退款单");

		// 添加操作记录（新退款单）
		oalesRecordService.addOalesRecord(oalesRO.getOid(), OalesRecordPO.TYPE_ADD, userId, "新增退款外销单");
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void scaleOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		// 使用前端传递的参数设置配比状态
		oalesPO.setIsScale(oalesVO.getIsScale());

		oalesDao.update(oalesPO);

		// 添加操作记录
		String scale = oalesVO.getIsScale() == OalesPO.ISSCALE_SCALE_INT ? "需配比" : "不需配比";
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_UPDATE, userId, "更新配比状态：" + scale);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPO.getStatus() != OalesPO.STATUS_INIT_INT) {
			throw new FLException(370022, "外销单状态不可操作");
		}

		if (oalesPayDao.countOalesPayByOid(oalesPO.getOid()) != 0) {
			throw new FLException(370027, "外销付款已存在");
		}

		long oid = oalesPO.getOid();
		oalesDao.delete(oalesPO);

		// 添加操作记录
		oalesRecordService.addOalesRecord(oid, OalesRecordPO.TYPE_DELETE, userId, "删除外销单");
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void activityOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		oalesPO.setIsActivity(oalesVO.getIsActivity());

		oalesDao.update(oalesPO);

		// 添加操作记录
		String activity = oalesVO.getIsActivity() == OalesPO.ISACTIVITY_YES_INT ? "参与活动" : "不参与活动";
		oalesRecordService.addOalesRecord(oalesPO.getOid(), OalesRecordPO.TYPE_ACTIVITY, userId, activity);
	}

}
