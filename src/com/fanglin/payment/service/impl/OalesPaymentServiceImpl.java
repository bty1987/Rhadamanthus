package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.OalesPaymentDao;
import com.fanglin.payment.dao.OalesReceiptDao;
import com.fanglin.payment.po.OalesPaymentPO;
import com.fanglin.payment.po.OalesReceiptPO;
import com.fanglin.payment.service.OalesPaymentService;
import com.fanglin.payment.vo.OalesPaymentVO;
import com.fanglin.payment.vo.OalesReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("oalesPaymentService")
@Transactional(readOnly = true)
public class OalesPaymentServiceImpl implements OalesPaymentService {

	@Autowired
	private OalesPaymentDao oalesPaymentDao;

	@Autowired
	private OalesReceiptDao oalesReceiptDao;

	@Autowired
	private OalesDao oalesDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageOalesPayment(Paging paging, List<Filter> filters, OalesPaymentVO oalesPayment, int company, String companyType) throws FLException {

		if (filters.size() == 0) return;

		if (companyType != null) filters.add(new Filter(companyType, String.valueOf(company), "eq"));

		if (oalesPayment != null) oalesPayment.filter(filters);

		List<OalesPaymentPO> oalesPaymentPOs = oalesPaymentDao.pageOalesPayment(paging, filters);
		List<OalesPaymentVO> oalesPaymentVOs = new ArrayList<OalesPaymentVO>();

		for (OalesPaymentPO oalesPaymentPO : oalesPaymentPOs) {
			oalesPaymentVOs.add(oalesPaymentPO.ptv(new OalesPaymentVO(new UserBaseVO(), new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new OalesReceiptVO(new UserBaseVO(), new UserBaseVO()))));
		}

		paging.setData(oalesPaymentVOs);
	}

	@Override
	public List<OalesPaymentVO> queryOalesPaymentByOid(OalesPaymentVO oalesPaymentVO) {

		List<OalesPaymentPO> oalesPaymentPOs = oalesPaymentDao.queryOalesPaymentsByOid(oalesPaymentVO.getOales().getOid());
		List<OalesPaymentVO> oalesPaymentVOs = new ArrayList<OalesPaymentVO>();

		for (OalesPaymentPO oalesPaymentPO : oalesPaymentPOs) {
			oalesPaymentVOs.add(oalesPaymentPO.ptv(new OalesPaymentVO(new UserBaseVO(), new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()))));
		}

		return oalesPaymentVOs;
	}

	@Override
	public List<OalesPaymentVO> queryOalesPaymentByOrderId(OalesPaymentVO oalesPayment, List<Filter> filters, int company, String companyType) throws FLException {

		String orderId = oalesPayment.getOales().getDecoration().getOrderId();
		String no = oalesPayment.getOales().getNo();
		Short status = oalesPayment.getStatus();

		if (orderId == "" && no == "") return null;

		if (no != null && no != "") {
			filters.add(new Filter("no", no, "eq"));
		}

		if (status != null) {
			filters.add(new Filter(OalesPaymentPO.COLUMN_STATUS_STR, String.valueOf(status), "eq"));
		}

		if (companyType != null && companyType != "") {
			filters.add(new Filter(String.format("oales.%s", companyType), String.valueOf(company), "eq"));
		}

		List<OalesPaymentPO> oalesPaymentPOs = oalesPaymentDao.queryOalesPaymentByOrderId(orderId, filters);
		List<OalesPaymentVO> oalesPaymentVOs = new ArrayList<OalesPaymentVO>();

		for (OalesPaymentPO oalesPaymentPO : oalesPaymentPOs) {
			oalesPaymentVOs.add(oalesPaymentPO.ptv(new OalesPaymentVO(new UserBaseVO(), new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()))));
		}

		return oalesPaymentVOs;
	}

	@Override
	public List<OalesPaymentVO> queryOalesPaymentForNotInitByOrid(OalesReceiptVO oalesReceipt) {

		List<OalesPaymentPO> oalesPaymentPOs = oalesPaymentDao.queryOalesPaymentForNotInitByOrid(oalesReceipt.getOrid());

		List<OalesPaymentVO> oalesPaymentVOs = new ArrayList<OalesPaymentVO>();

		for (OalesPaymentPO oalesPaymentPO : oalesPaymentPOs) {
			oalesPaymentVOs.add(oalesPaymentPO.ptv(new OalesPaymentVO(new UserBaseVO(), new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new OalesReceiptVO(new UserBaseVO(), new UserBaseVO()))));
		}

		return oalesPaymentVOs;
	}

	@Override
	public OalesPaymentVO queryOalesPaymentByOpid(OalesPaymentVO oalesPaymentVO) {

		OalesPaymentPO oalesPaymentPO = oalesPaymentDao.get(oalesPaymentVO.getOpid());

		return oalesPaymentPO.ptv(new OalesPaymentVO(new UserBaseVO(), new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
	}

	// 添加定金销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOalesPayment(OalesPaymentVO oalesPaymentVO, String cuid, int company) throws FLException {

		long oid = oalesPaymentVO.getOales().getOid();

		OalesPO oales = oalesDao.get(oid);

		if (oales == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPaymentVO.getReferMoney() < 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		List<OalesPaymentPO> oalesPaymentPOs = oalesPaymentDao.queryOalesPaymentsByOid(oid);

		if (oalesPaymentPOs.size() > 0) {
			throw new FLException(150029, "款项不可提交");
		}

		OalesPaymentPO oalesPaymentPO = new OalesPaymentPO(new UserPO(), new OalesPO());

		BeanUtil.copyProperties(oalesPaymentVO, oalesPaymentPO, Arrays.asList("oales", "collecter", "confirmer"));

		oalesPaymentPO.setOales(oales);
		oalesPaymentPO.setType(oales.getType());
		oalesPaymentPO.setStatus(OalesPaymentPO.STATUS_INITIAL_INT);
		oalesPaymentPO.setCategory(oales.getCategory());
		oalesPaymentPO.setBrand(oales.getBrand());

		UserPO userPO = userDao.queryUserByUserId(cuid);

		oalesPaymentPO.setCreater(userPO);
		oalesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		oalesPaymentPO.setCompany(company);

		oalesPaymentDao.save(oalesPaymentPO);

		oalesPaymentVO.setOpid(oalesPaymentPO.getOpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectOalesPayment(OalesPaymentVO oalesPaymentVO, OalesReceiptVO oalesReceiptVO, List<Long> ptids, String userId, Integer company) throws FLException {

		OalesPaymentPO oalesPayment = oalesPaymentDao.get(oalesPaymentVO.getOpid());

		if (oalesPayment == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (oalesPayment.getStatus() != OalesPaymentPO.STATUS_INITIAL_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}

		OalesPO oales = oalesPayment.getOales();

		if (oales == null) {
			throw new FLException(370021, "外销单不存在");
		}

		UserPO collecter = userDao.queryUserByUserId(userId);

		if (collecter == null) {
			throw new FLException(190005, "人员不存在");
		}

		OalesReceiptPO oalesReceiptPO = new OalesReceiptPO();

		oalesReceiptPO.setCollecter(collecter);
		oalesReceiptPO.setCollecterName(collecter.getUserName());
		oalesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));

		if (oalesReceiptVO.getCash() != null && oalesReceiptVO.getCash() != 0) {
			oalesReceiptPO.setCash(oalesReceiptVO.getCash());
			oalesReceiptPO.setCashInfo(oalesReceiptVO.getCashInfo());
		} else {
			oalesReceiptPO.setCash(0);
			oalesReceiptPO.setCashInfo("");
		}

		if (oalesReceiptVO.getBank() != null && oalesReceiptVO.getBank() != 0) {
			oalesReceiptPO.setBank(oalesReceiptVO.getBank());
			oalesReceiptPO.setBankInfo(oalesReceiptVO.getBankInfo());
		} else {
			oalesReceiptPO.setBank(0);
			oalesReceiptPO.setBankInfo("");
		}

		if (oalesReceiptVO.getCheckv() != null && oalesReceiptVO.getCheckv() != 0) {
			oalesReceiptPO.setCheckv(oalesReceiptVO.getCheckv());
			oalesReceiptPO.setCheckvBank(oalesReceiptVO.getCheckvBank());
		} else {
			oalesReceiptPO.setCheckv(0);
			oalesReceiptPO.setCheckvBank("");
		}

		if (oalesReceiptVO.getComment() != null) {
			oalesReceiptPO.setComment(oalesReceiptVO.getComment());
		} else {
			oalesReceiptPO.setComment("");
		}

		oalesReceiptPO.setType(OalesReceiptPO.TYPE_PAYMENT_INT);

		Long referMoneySR = Arith.add(Arith.add(oalesReceiptPO.getCash(), oalesReceiptPO.getBank()), oalesReceiptPO.getCheckv());
		Long referMoneyDB = oalesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		oalesReceiptPO.setRealMoney(oalesReceiptVO.getRealMoney());

		oalesReceiptDao.save(oalesReceiptPO);

		oalesPayment.setOalesReceipt(oalesReceiptPO);
		oalesPayment.setStatus(OalesPaymentPO.STATUS_PAIDFOR_INT);

		oalesPaymentDao.update(oalesPayment);

		if (oales.getStatus() != OalesPO.STATUS_CHECK_INT) {
			oales.setStatus(OalesPO.STATUS_CHECK_INT);
			oales.setCheckTime(oalesReceiptPO.getCollectTime());
		}

		oalesDao.update(oales);

		return 0;
	}

	// 销售退款收款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundOalesPayment(OalesPaymentVO oalesPaymentVO, OalesReceiptVO oalesReceiptVO, String userId, Integer company) throws FLException {

		OalesPaymentPO oalesPayment = oalesPaymentDao.get(oalesPaymentVO.getOpid());

		if (oalesPayment == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (oalesPayment.getStatus() != OalesPaymentPO.STATUS_INITIAL_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}

		OalesReceiptPO oalesReceiptPO = new OalesReceiptPO();

		UserPO user = userDao.queryUserByUserId(userId);

		oalesReceiptPO.setCollecter(user);
		oalesReceiptPO.setCollecterName(user.getUserName());
		oalesReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));

		if (oalesReceiptVO.getCash() != null) {
			oalesReceiptPO.setCash(oalesReceiptVO.getCash());
			oalesReceiptPO.setCashInfo(oalesReceiptVO.getCashInfo());
		} else {
			oalesReceiptPO.setCash(0);
			oalesReceiptPO.setCashInfo("");
		}

		if (oalesReceiptVO.getBank() != null) {
			oalesReceiptPO.setBank(oalesReceiptVO.getBank());
			oalesReceiptPO.setBankInfo(oalesReceiptVO.getBankInfo());
		} else {
			oalesReceiptPO.setBank(0);
			oalesReceiptPO.setBankInfo("");
		}

		if (oalesReceiptVO.getCheckv() != null) {
			oalesReceiptPO.setCheckv(oalesReceiptVO.getCheckv());
			oalesReceiptPO.setCheckvBank(oalesReceiptVO.getCheckvBank());
		} else {
			oalesReceiptPO.setCheckv(0);
			oalesReceiptPO.setCheckvBank("");
		}

		if (oalesReceiptVO.getComment() != null) {
			oalesReceiptPO.setComment(oalesReceiptVO.getComment());
		} else {
			oalesReceiptPO.setComment("");
		}

		oalesReceiptPO.setType(OalesReceiptPO.TYPE_REFUND_INT);

		Long referMoneySR = Arith.add(Arith.add(oalesReceiptPO.getCash(), oalesReceiptPO.getBank()), oalesReceiptPO.getCheckv());
		Long referMoneyDB = oalesPayment.getReferMoney();

		if (Arith.sub(referMoneySR, referMoneyDB) != 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		oalesReceiptPO.setRealMoney(oalesReceiptVO.getRealMoney());

		oalesReceiptDao.save(oalesReceiptPO);

		OalesPO oales = oalesPayment.getOales();

		oalesPayment.setOalesReceipt(oalesReceiptPO);
		oalesPayment.setStatus(OalesPaymentPO.STATUS_PAIDFOR_INT);
		oalesPayment.setCompany(oales.getCompany());

		oalesPaymentDao.update(oalesPayment);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmOalesPayment(List<Long> opids, String userId) throws FLException {

		UserPO user = userDao.queryUserByUserId(userId);

		for (Long opid : opids) {

			OalesPaymentPO oalesPayment = oalesPaymentDao.get(opid);

			if (oalesPayment == null) {
				throw new FLException(150003, "款项不存在");
			}

			if (oalesPayment.getStatus() != OalesPaymentPO.STATUS_PAIDFOR_INT) {
				throw new FLException(150036, "款项状态不可操作");
			}

			oalesPayment.setStatus(OalesPaymentPO.STATUS_CONFIRMED_INT);
			oalesPaymentDao.update(oalesPayment);

			OalesReceiptPO oalesReceiptPO = oalesPayment.getOalesReceipt();
			oalesReceiptPO.setConfirmTime(new Timestamp(System.currentTimeMillis()));

			oalesReceiptPO.setConfirmer(user);
			oalesReceiptPO.setConfirmerName(user.getUserName());

			oalesReceiptDao.update(oalesReceiptPO);

		}

		return 0;
	}

	// 撤销定金销售款
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelOalesPayment(OalesPaymentVO oalesPaymentVO) throws FLException {

		OalesPaymentPO oalesPaymentPO = oalesPaymentDao.get(oalesPaymentVO.getOpid());

		if (oalesPaymentPO == null) {
			throw new FLException(150037, "定金不存在");
		}

		if (oalesPaymentPO.getStatus() != OalesPaymentPO.STATUS_INITIAL_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}

		oalesPaymentDao.delete(oalesPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateOalesPayment(OalesPaymentVO oalesPayment, OalesReceiptVO oalesReceipt) throws FLException {

		long realMoney = 0;

		OalesPaymentPO oalesPaymentPO = oalesPaymentDao.get(oalesPayment.getOpid());

		if (oalesPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		OalesReceiptPO oalesReceiptPO = oalesPaymentPO.getOalesReceipt();

		if (oalesPaymentPO.getStatus() != 1) {
			throw new FLException(150036, "款项状态不可操作");
		}

		long referMoney = Arith.add(Arith.add(Arith.add(Arith.add(oalesReceiptPO.getCash(), oalesReceiptPO.getBank()), oalesReceiptPO.getCheckv()), oalesReceiptPO.getInstallment()), oalesReceiptPO.getAccounts());

		Long cash = oalesReceipt.getCash();
		Long bank = oalesReceipt.getBank();
		Long checkv = oalesReceipt.getCheckv();

		if (cash != null && cash != 0) {
			oalesReceiptPO.setCash(cash);
			oalesReceiptPO.setCashInfo(oalesReceipt.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		} else {
			oalesReceiptPO.setCash(0);
			oalesReceiptPO.setCashInfo("");
		}

		if (checkv != null && checkv != 0) {
			oalesReceiptPO.setCheckv(checkv);
			oalesReceiptPO.setCheckvBank(oalesReceipt.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		} else {
			oalesReceiptPO.setCheckv(0);
			oalesReceiptPO.setCheckvBank("");
		}

		if (bank != null && bank != 0) {
			realMoney = Arith.add(bank, realMoney);
		}

		if (referMoney != realMoney) {
			throw new FLException(150025, "款项金额不正确");
		}

		oalesReceiptPO.setRealMoney(oalesReceipt.getRealMoney());

		oalesReceiptDao.update(oalesReceiptPO);

	}

}
