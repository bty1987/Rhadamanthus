package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.balance.service.BalanceSalesBalanceService;
import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.SalesDeliveryStatusRightDao;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.dao.SalesBalanceItemDao;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesBalanceItemPO;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesBalanceService;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("salesBalanceService")
@Transactional(readOnly = true)
public class SalesBalanceServiceImpl implements SalesBalanceService {

	@Autowired
	private SalesBalanceDao salesBalanceDao;

	@Autowired
	private SalesBalanceItemDao salesBalanceItemDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesItemDao salesItemDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesDeliveryStatusRightDao salesDeliveryStatusRightDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private BalanceSalesBalanceService balanceSalesBalanceService;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	public List<SalesBalanceVO> pageSalesBalance(List<SalesBalancePO> salesBalancePOs) {

		List<SalesBalanceVO> salesBalanceVOs = new ArrayList<SalesBalanceVO>();

		for (SalesBalancePO salesBalancePO : salesBalancePOs) {
			salesBalanceVOs.add(salesBalancePO.ptv(new SalesBalanceVO(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO()), new SalesRefundsVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO())));
		}

		return salesBalanceVOs;
	}

	@Override
	public void pageSalesBalance(Paging paging, List<Filter> filters, SalesBalanceVO salesBalanceVO, int company) throws FLException {

		if (filters.size() == 0) return;

		short type = 0;

		if (salesBalanceVO != null && salesBalanceVO.getSales() != null && salesBalanceVO.getSales().getType() != null) type = salesBalanceVO.getSales().getType();

		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalance(paging, filters, type, company);

		List<SalesBalanceVO> salesBalanceVOs = pageSalesBalance(salesBalancePOs);

		paging.setData(salesBalanceVOs);
	}

	@Override
	public void pageSalesBalanceForDompany(Paging paging, List<Filter> filters, SalesBalanceVO salesBalanceVO, int dompany) throws FLException {

		if (filters.size() == 0) return;

		short type = 0;

		if (salesBalanceVO != null && salesBalanceVO.getSales() != null && salesBalanceVO.getSales().getType() != null) type = salesBalanceVO.getSales().getType();

		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalanceForDompany(paging, filters, type, dompany);

		List<SalesBalanceVO> salesBalanceVOs = pageSalesBalance(salesBalancePOs);

		paging.setData(salesBalanceVOs);
	}

	@Override
	public void pageSalesBalanceForPompany(Paging paging, List<Filter> filters, SalesBalanceVO salesBalanceVO, int pompany) throws FLException {

		if (filters.size() == 0) return;

		short type = 0;

		if (salesBalanceVO != null && salesBalanceVO.getSales() != null && salesBalanceVO.getSales().getType() != null) type = salesBalanceVO.getSales().getType();

		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalanceForPompany(paging, filters, type, pompany);

		List<SalesBalanceVO> salesBalanceVOs = pageSalesBalance(salesBalancePOs);

		paging.setData(salesBalanceVOs);

	}

	@Override
	public void pageSalesBalanceForSupplier(Paging paging, List<Filter> filters, String userId, int pompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (filters.size() == 0) return;

		if (userPO == null) return;

		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalanceForSupplier(paging, filters, pompany, userPO.getUid());

		List<SalesBalanceVO> salesBalanceVOs = pageSalesBalance(salesBalancePOs);

		paging.setData(salesBalanceVOs);
	}

	@Override
	public void pageSalesBalanceForCheck(Paging paging, List<Filter> filters, SalesBalanceVO salesBalanceVO, int pompany) throws FLException {

		if (filters.size() == 0) return;

		short type = 0;

		if (salesBalanceVO != null && salesBalanceVO.getSales() != null && salesBalanceVO.getSales().getType() != null) type = salesBalanceVO.getSales().getType();

		List<SalesBalancePO> salesBalancePOs = salesBalanceDao.pageSalesBalanceForCheck(paging, filters, type, pompany);

		List<SalesBalanceVO> salesBalanceVOs = pageSalesBalance(salesBalancePOs);

		paging.setData(salesBalanceVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesBalanceForVBalance(SalesBalanceVO salesBalanceVO) throws FLException {

		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());

		if (salesBalancePO == null) {
			throw new FLException(260037, "销售结算信息不存在");
		}

		if (salesBalancePO.getStatus() != SalesBalancePO.STATUS_PREBALANCE_INT) {
			throw new FLException(260038, "销售结算状态不可操作");
		}

		salesBalancePO.setVbalance(salesBalanceVO.getVbalance());

		salesBalanceDao.update(salesBalancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesBalanceForPBalance(SalesBalanceVO salesBalanceVO) throws FLException {

		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());

		if (salesBalancePO == null) {
			throw new FLException(260037, "销售结算信息不存在");
		}

		if (salesBalancePO.getStatus() != SalesBalancePO.STATUS_VENDORBALANCE_INT) {
			throw new FLException(260038, "销售结算状态不可操作");
		}

		salesBalancePO.setPbalance(salesBalanceVO.getPbalance());

		salesBalanceDao.update(salesBalancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rpreSalesBalance(SalesBalanceVO salesBalanceVO) throws FLException {

		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());

		if (salesBalancePO == null) {
			throw new FLException(260037, "销售结算信息不存在");
		}

		if (salesBalancePO.getStatus() != SalesBalancePO.STATUS_VENDORBALANCE_INT) {
			throw new FLException(260038, "销售结算状态不可操作");
		}

		SalesPO salesPO = salesDao.get(salesBalancePO.getSales().getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesBalancePO.getOnetype() == SalesBalancePO.ONETYPE_INIT_INT && salesBalancePO.getType() == SalesBalancePO.TYPE_INIT_INT) {

			salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT);

			salesDao.update(salesPO);
		}

		salesBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);

		salesBalanceDao.update(salesBalancePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int passSalesBalance(List<Long> sids) throws FLException {

		for (long sid : sids) {

			SalesPO salesPO = salesDao.get(sid);

			if (salesPO == null) {
				throw new FLException(260021, "销售单不存在");
			}

			if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT && salesPO.getStatus() != SalesPO.STATUS_END_SHORT) {
				throw new FLException(260022, "销售单状态不可操作");
			}

			salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_FINISH_SHORT);

			salesDao.update(salesPO);
		}

		return 0;
	}

	// 不退定金结算
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int advSalesBalance(List<Long> sids, String userId) throws FLException {

		for (long sid : sids) {

			SalesPO salesPO = salesDao.get(sid);

			if (salesPO == null) {
				throw new FLException(260021, "销售单不存在");
			}

			if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT && salesPO.getStatus() != SalesPO.STATUS_END_SHORT) {
				throw new FLException(260022, "销售单状态不可操作");
			}

			if (salesPO.getBalanceStatus() != SalesPO.BALANCESTATUS_INIT_SHORT) {
				throw new FLException(260022, "销售单状态不可操作");
			}

			ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, String.valueOf(sid));

			if (approvalPO != null) {
				throw new FLException(240007, "存在未处理审批信息");
			}

			if (salesPO.getCtype() == SalesPO.CTYPE_PASS_INT) {
				continue;
			}

			SalesBalancePO salesBalancePO = new SalesBalancePO();

			UserPO userPO = userDao.queryUserByUserId(userId);

			salesBalancePO.setSales(salesPO);
			salesBalancePO.setCreater(userPO);
			salesBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesBalancePO.setType(SalesBalancePO.TYPE_DEPOSITPAY_INT); // 定金
			salesBalancePO.setOnetype(SalesBalancePO.ONETYPE_INIT_INT);
			salesBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);
			salesBalancePO.setComment(salesPO.getComment());
			salesBalancePO.setSalesman(salesPO.getSalesman());
			salesBalancePO.setDept(salesPO.getDept());
			salesBalancePO.setRegion(salesPO.getRegion());

			long balance = 0;
			long allowance = 0;

			long depositpay = salesPO.getDepositpay();

			// 点位
			if (salesPO.getCtype() == SalesPO.CTYPE_POINT_INT) {
				balance = Arith.mul(Arith.sub(depositpay, Arith.mul(depositpay, Arith.sub(1000, salesPO.getCvalue()))), 1000);
			}

			// 底价
			if (salesPO.getCtype() == SalesPO.CTYPE_RESERVEPRICE_INT) {
				balance = Arith.mul(Arith.sub(depositpay, salesPO.getCvalue()), 1000);
			}

			allowance = Arith.add(allowance, Arith.mul(Arith.sub(depositpay, depositpay), 1000));

			salesBalancePO.setTotal(depositpay);
			salesBalancePO.setAllowance(allowance);
			salesBalancePO.setBalance(balance);
			salesBalancePO.setRate(1000);

			long vbalance = Arith.sub(Arith.round(depositpay, 0, Arith.ROUND_FLOOR), Arith.round(balance, 0, Arith.ROUND_CEILING));

			salesBalancePO.setVbalance(vbalance);
			salesBalancePO.setPbalance(vbalance);
			salesBalancePO.setDifference(Arith.sub(depositpay, balance));

			salesBalanceDao.save(salesBalancePO);
		}

		return 0;
	}

	// 反向不退定金结算
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int revSalesBalance(List<Long> sids, String userId) throws FLException {

		for (long sid : sids) {

			SalesPO salesPO = salesDao.get(sid);

			if (salesPO == null) {
				throw new FLException(260021, "销售单不存在");
			}

			if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT && salesPO.getStatus() != SalesPO.STATUS_END_SHORT) {
				throw new FLException(260022, "销售单状态不可操作");
			}

			if (salesPO.getBalanceStatus() != SalesPO.BALANCESTATUS_INIT_SHORT) {
				throw new FLException(260022, "销售单状态不可操作");
			}

			ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, String.valueOf(sid));

			if (approvalPO != null) {
				throw new FLException(240007, "存在未处理审批信息");
			}

			// 判断有没有定金购货的数据
			SalesBalancePO salesBalancePO = salesBalanceDao.querySalesBalance(sid, SalesBalancePO.TYPE_DEPOSITPAY_INT, SalesBalancePO.ONETYPE_INIT_INT);

			if (salesBalancePO == null) {
				continue;
			}

			long depositpay = salesPO.getDepositpay();
			long balance = salesBalancePO.getBalance();

			SalesBalancePO reveBalancePO = new SalesBalancePO();

			BeanUtil.copyPropertie(salesBalancePO, reveBalancePO);

			long vbalance = Arith.sub(Arith.round(depositpay, 0, Arith.ROUND_FLOOR), Arith.round(balance, 0, Arith.ROUND_CEILING));

			reveBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);
			reveBalancePO.setOnetype(SalesBalancePO.ONETYPE_REFUND_INT);

			reveBalancePO.setBalance(-balance);
			reveBalancePO.setPbalance(-vbalance);
			reveBalancePO.setVbalance(-vbalance);
			reveBalancePO.setTotal(-salesBalancePO.getTotal());
			reveBalancePO.setRate(1000);

			reveBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			salesBalanceDao.save(reveBalancePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int preSalesBalance(List<Long> sids, String userId) throws FLException {

		for (long sid : sids) {

			SalesPO salesPO = salesDao.get(sid);

			if (salesPO == null) {
				throw new FLException(260021, "销售单不存在");
			}

			if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT && salesPO.getStatus() != SalesPO.STATUS_END_SHORT) {
				throw new FLException(260022, "销售单状态不可操作");
			}

			if (salesPO.getBalanceStatus() != SalesPO.BALANCESTATUS_INIT_SHORT) {
				throw new FLException(260022, "销售单状态不可操作");
			}

			ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, String.valueOf(sid));

			if (approvalPO != null) {
				throw new FLException(240007, "存在未处理审批信息");
			}

			SalesBalancePO salesBalancePO = new SalesBalancePO();

			UserPO userPO = userDao.queryUserByUserId(userId);

			long balance = 0;

			salesBalancePO.setSales(salesPO);
			salesBalancePO.setCreater(userPO);
			salesBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesBalancePO.setTotal(salesPO.getTotal());
			salesBalancePO.setBalance(balance);
			salesBalancePO.setType(SalesBalancePO.TYPE_INIT_INT);
			salesBalancePO.setStatus(SalesBalancePO.STATUS_PREBALANCE_INT);
			salesBalancePO.setSalesman(salesPO.getSalesman());
			salesBalancePO.setDept(salesPO.getDept());
			salesBalancePO.setRegion(salesPO.getRegion());

			salesBalanceDao.save(salesBalancePO);

			List<SalesItemPO> salesItemPOs = salesItemDao.querySalesItemBySid(salesPO.getSid());

			long _allowance = 0;

			for (SalesItemPO salesItemPO : salesItemPOs) {

				long _price = salesItemPO.getPrice();
				long _disPrice = salesItemPO.getDisPrice();

				if (salesItemPO.getCtype() == SalesItemPO.CTYPE_POINT_INT) {
					long _balance = Arith.mul(Arith.sub(_price, Arith.mul(_disPrice, Arith.sub(1000, salesItemPO.getCvalue()))), salesItemPO.getNum());
					balance = Arith.add(balance, _balance);
				}

				if (salesItemPO.getCtype() == SalesItemPO.CTYPE_RESERVEPRICE_INT) {
					long _balance = Arith.mul(Arith.sub(_price, salesItemPO.getCvalue()), salesItemPO.getNum());
					balance = Arith.add(balance, _balance);
				}

				_allowance = Arith.add(_allowance, Arith.mul(Arith.sub(salesItemPO.getDisPrice(), salesItemPO.getPrice()), salesItemPO.getNum()));

				SalesBalanceItemPO salesBalanceItemPO = new SalesBalanceItemPO();
				salesBalanceItemPO.setSbid(salesBalancePO.getSbid());
				salesBalanceItemPO.setSalesItem(salesItemPO);
				salesBalanceItemPO.setRawCtype(salesItemPO.getRawCtype());
				salesBalanceItemPO.setRawCvalue(salesItemPO.getRawCvalue());
				salesBalanceItemPO.setCtype(salesItemPO.getCtype());
				salesBalanceItemPO.setCvalue(salesItemPO.getCvalue());
				salesBalanceItemPO.setNum(salesItemPO.getNum());
				salesBalanceItemPO.setTotal(salesItemPO.getTotal());

				salesBalanceItemDao.save(salesBalanceItemPO);
			}

			salesBalancePO.setAllowance(_allowance);
			salesBalancePO.setOnetype(SalesBalancePO.ONETYPE_INIT_INT);
			salesBalancePO.setBalance(balance);
			salesBalancePO.setRate(1000);

			SystemConfigPO taggle = systemConfigDao.querySystemConfig("SALES_MUILT_BALANCE_INT", salesPO.getCompany());

			if (taggle != null && taggle.getValue() != null && salesDeliveryStatusRightDao.countSalesDeliveryStatusRight(salesPO.getBrand().getBid()) > 0) salesBalancePO.setType(SalesBalancePO.TYPE_BALANCE_INT);

			long vbalance = Arith.sub(Arith.round(salesPO.getTotal(), 0, Arith.ROUND_FLOOR), Arith.round(balance, 0, Arith.ROUND_CEILING));

			salesBalancePO.setVbalance(vbalance);
			salesBalancePO.setPbalance(vbalance);
			salesBalancePO.setDifference(Arith.sub(salesBalancePO.getTotal(), balance));

			salesBalanceDao.update(salesBalancePO);

			salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_PRESETTLEMENT_SHORT);

			salesDao.update(salesPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int vpostSalesBalance(List<SalesBalanceVO> sbids, String userId) throws FLException {

		for (SalesBalanceVO salesBalanceVO : sbids) {

			SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());

			if (salesBalancePO == null) {
				throw new FLException(260037, "销售结算信息不存在");
			}

			if (salesBalancePO.getStatus() != SalesBalancePO.STATUS_PREBALANCE_INT) {
				throw new FLException(260038, "销售结算状态不可操作");
			}

			SalesPO salesPO = salesDao.get(salesBalancePO.getSales().getSid());

			if (salesPO == null) {
				throw new FLException(260021, "销售单不存在");
			}

			UserPO voster = userDao.queryUserByUserId(userId);

			salesBalancePO.setStatus(SalesBalancePO.STATUS_VENDORBALANCE_INT);
			salesBalancePO.setVoster(voster);
			salesBalancePO.setVenderTime(DateUtil.getDateToTimestamp(new Date()));

			salesBalanceDao.update(salesBalancePO);

			SystemConfigPO taggle = systemConfigDao.querySystemConfig("SALES_AUTO_BALANCE_INT", salesPO.getCompany());

			if (salesBalancePO.getOnetype() == SalesBalancePO.ONETYPE_INIT_INT && salesBalancePO.getType() == SalesBalancePO.TYPE_INIT_INT) {

				salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_VENDORSETTLEMENT_SHORT);

				salesDao.update(salesPO);

				if (taggle == null || taggle.getValue() == null) continue;

				List<SalesBalancePO> salesBalancePOs = salesBalanceDao.querySalesBalance(salesBalancePO.getSales().getSid(), SalesBalancePO.CHECKSTATUS_INIT_INT);

				for (SalesBalancePO salesBalanceBO : salesBalancePOs) {

					if (salesBalanceBO.getStatus() == SalesBalancePO.STATUS_PREBALANCE_INT) continue;

					balanceSalesBalanceService.submitBalanceSalesBalance(null, new BalanceSalesBalanceVO(new SalesBalanceVO(salesBalanceBO.getSbid())), userId, salesBalanceBO.getSales().getCompany());
				}
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int postSalesBalance(List<SalesBalanceVO> sbids, String userId) throws FLException {

		for (SalesBalanceVO salesBalanceVO : sbids) {

			SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());

			if (salesBalancePO == null) {
				throw new FLException(260037, "销售结算信息不存在");
			}

			if (salesBalancePO.getStatus() != SalesBalancePO.STATUS_VENDORBALANCE_INT) {
				throw new FLException(260038, "销售结算状态不可操作");
			}

			SalesPO salesPO = salesDao.get(salesBalancePO.getSales().getSid());

			if (salesPO == null) {
				throw new FLException(260021, "销售单不存在");
			}

			UserPO poster = userDao.queryUserByUserId(userId);

			salesBalancePO.setStatus(SalesBalancePO.STATUS_BALANCE_INT);
			salesBalancePO.setPoster(poster);
			salesBalancePO.setPostTime(DateUtil.getDateToTimestamp(new Date()));

			salesBalanceDao.update(salesBalancePO);

			if (salesBalancePO.getOnetype() == SalesBalancePO.ONETYPE_INIT_INT && salesBalancePO.getType() == SalesBalancePO.TYPE_INIT_INT) {

				salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_SETTLEMENT_SHORT);
				salesPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));

				salesDao.update(salesPO);
			}

			decorationAdditionService.updateDecorationForSaleScale(new DecorationVO(salesBalancePO.getSales().getOrderId()));
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectSalesBalance(SalesBalanceVO salesBalanceVO, String userId) throws FLException {

		SalesBalancePO salesBalancePO = salesBalanceDao.get(salesBalanceVO.getSbid());

		if (salesBalancePO == null) {
			throw new FLException(260037, "销售结算信息不存在");
		}

		if (salesBalancePO.getOnetype() != SalesBalancePO.ONETYPE_INIT_INT) {
			throw new FLException(260038, "销售结算状态不可操作");
		}

		if (salesBalancePO.getStatus() != SalesBalancePO.STATUS_PREBALANCE_INT) {
			throw new FLException(260038, "销售结算状态不可操作");
		}

		SalesPO salesPO = salesDao.get(salesBalancePO.getSales().getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_TYPE_SALESREFUND_PAYMENT_INT, String.valueOf(salesPO.getSid()));

		if (approvalPO != null) {
			throw new FLException(240007, "存在未处理审批信息");
		}

		salesBalanceDao.delete(salesBalancePO);

		salesPO.setBalanceStatus(SalesPO.BALANCESTATUS_INIT_SHORT);

		salesDao.update(salesPO);

		if (SalesPO.TYPE_INIT_INT == salesPO.getType()) return 0;

		List<SalesPaymentPO> salesPaymentPOs = salesPaymentDao.querySalesPaymentsBySid(salesPO.getSid());

		for (SalesPaymentPO salesPaymentPO : salesPaymentPOs) {
			salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);

			salesPaymentDao.update(salesPaymentPO);
		}

		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);

		salesDao.update(salesPO);

		return 0;
	}
}
