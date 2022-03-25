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
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ComplainDao;
import com.fanglin.customer.dao.ComplaintDao;
import com.fanglin.customer.dao.ConsultionDao;
import com.fanglin.customer.po.ComplainPO;
import com.fanglin.customer.po.ComplaintPO;
import com.fanglin.customer.po.ConsultionPO;
import com.fanglin.customer.service.ComplainService;
import com.fanglin.customer.vo.ComplainVO;
import com.fanglin.customer.vo.ComplaintVO;
import com.fanglin.customer.vo.ConsultionVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("complainService")
@Transactional(readOnly = true)
public class ComplainServiceImpl implements ComplainService {

	@Autowired
	private ComplainDao complainDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private DepartmentDao deptDao;

	@Autowired
	private ComplaintDao complaintDao;

	@Autowired
	private ConsultionDao consultionDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageComplain(Paging paging, List<Filter> filters, int company) {

		List<ComplainPO> complainPOs = complainDao.pageComplain(paging, filters, company);

		List<ComplainVO> complainVOs = new ArrayList<ComplainVO>();

		for (ComplainPO complainPO : complainPOs) {

			complainVOs.add(complainPOToVO(complainPO));
		}

		paging.setData(complainVOs);

	}

	@Override
	public List<ComplainVO> queryComplain(ComplainVO complain) {

		List<ComplainPO> complainPOs = complainDao.queryComplain(complain.getCsid());

		List<ComplainVO> complainVOs = new ArrayList<ComplainVO>();

		for (ComplainPO complainPO : complainPOs) {

			complainVOs.add(complainPOToVO(complainPO));
		}

		return complainVOs;
	}

	@Override
	public List<ComplainVO> queryComplainByOrderId(ComplainVO complain) {

		List<ComplainPO> complainPOs = complainDao.queryComplainByOrderId(complain.getDecoration().getOrderId());

		List<ComplainVO> complainVOs = new ArrayList<ComplainVO>();

		for (ComplainPO complainPO : complainPOs) {

			complainVOs.add(complainPOToVO(complainPO));
		}

		return complainVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addComplain(ConsultionVO consultion, ComplainVO complain, List<ComplaintVO> complaints, String UserId, int company) throws FLException {

		ComplainPO complainPO = new ComplainPO();
		UserPO creater = userDao.queryUserByUserId(UserId);

		if (consultion.getCid() == null) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(consultion.getDecoration().getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "	订单不存在");
			}

			CompanyPO companyPO = companyDao.get(company);

			ConsultionPO consultionPO = new ConsultionPO(decorationPO, creater);
			BeanUtil.copyProperties(consultion, consultionPO, Arrays.asList("decoration", "creater"));

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_COMSULTION_NO_INT, currentDate, company);
			String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			consultionPO.setNo(no);
			consultionPO.setCompany(company);

			consultionDao.save(consultionPO);

			complainPO.setCsid(consultionPO.getCid());

			complainPO.setDecoration(decorationPO);

		} else {

			ConsultionPO consultionPO = consultionDao.get(consultion.getCid());

			complainPO.setCsid(consultionPO.getCid());

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(consultion.getDecoration().getOrderId());

			if (decorationPO == null) {
				throw new FLException(140013, "	订单不存在");
			}

			complainPO.setDecoration(decorationPO);
		}

		complainPO.setLevel(complain.getLevel());
		complainPO.setCreater(creater);
		complainPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		complainPO.setCompany(company);

		complainDao.save(complainPO);

		for (ComplaintVO complaintVO : complaints) {

			ComplaintPO complaint = new ComplaintPO();

			DepartmentPO dept = deptDao.get(complaintVO.getDept().getDid());
			UserPO staff = userDao.get(complaintVO.getStaff().getUid());
			BrandPO brand = brandDao.get(complaintVO.getBrand().getBid());

			complaint.setCid(complainPO.getCid());
			complaint.setCreater(creater);
			complaint.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			complaint.setType(complaintVO.getType());
			complaint.setDept(dept);
			complaint.setStaff(staff);
			complaint.setBrand(brand);
			complaint.setContent(complaintVO.getContent());

			complaintDao.save(complaint);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishComplain(ComplainVO complain, String UserId) throws FLException {

		ComplainPO complainPO = complainDao.get(complain.getCid());

		if (complainPO == null) {
			throw new FLException(330037, "投诉信息不存在");
		}

		if (complainPO.getStatus() != ComplainPO.STATUS_DISPOSE_SHORT) {
			throw new FLException(330038, "投诉状态不可操作");
		}

		UserPO updater = userDao.queryUserByUserId(UserId);

		complainPO.setUpdater(updater);
		complainPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		complainPO.setStatus(ComplainPO.STATUS_END_SHORT);

		complainDao.update(complainPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int closeComplain(ComplainVO complain, String UserId) throws FLException {

		ComplainPO complainPO = complainDao.get(complain.getCid());

		if (complainPO == null) {
			throw new FLException(330037, "投诉信息不存在");
		}

		if (complainPO.getStatus() != ComplainPO.STATUS_END_SHORT) {
			throw new FLException(330038, "投诉状态不可操作");
		}

		complainPO.setStatus(ComplainPO.STATUS_CLOSE_SHORT);

		complainDao.update(complainPO);

		return 0;
	}

	public ComplainVO complainPOToVO(ComplainPO complainPO) {

		ComplainVO complainVO = new ComplainVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyProperties(complainPO, complainVO, Arrays.asList("decoration", "creater", "updater"));
		BeanUtil.copyProperties(complainPO.getCreater(), complainVO.getCreater(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(complainPO.getUpdater(), complainVO.getUpdater(), Arrays.asList("duty", "dept"));

		if (complainPO.getDecoration() != null) {
			complainPO.getDecoration().ptvcascade(complainVO.getDecoration());
		}

		return complainVO;
	}

}
