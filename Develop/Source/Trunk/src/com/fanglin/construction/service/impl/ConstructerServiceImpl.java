package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.ConstructerService;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.utils.BeanUtil;

@Service("constructerService")
@Transactional(readOnly=true)
public class ConstructerServiceImpl implements ConstructerService {

	@Autowired
	private ConstructerDao constructerDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ConstructionDao constructionDao;
	
	@Autowired
	private WorkerSalaryDao workerSalaryDao;

	@Override
	public List<ConstructerVO> queryConstructerByOrderId(ConstructerVO constructerVO) {
//		通过订单编号获取施工人员信息 , 同时可以利用schedule获取具体施工环节人员信息
//		如果schedule没有传值将返回订单编号对应的所有施工人员信息
		String orderId = constructerVO.getOrderId();
		Integer schedule = constructerVO.getSchedule();
		
		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByOrderId(orderId,schedule);
		List<ConstructerVO> constructerVOs = new ArrayList<ConstructerVO>();
		
		for (ConstructerPO constructerPO : constructerPOs) {
			ConstructerVO constructerV = new ConstructerVO(new UserVO());
			BeanUtil.copyProperties(constructerPO, constructerV,Arrays.asList("user","creater"));
			BeanUtil.copyProperties(constructerPO.getUser(), constructerV.getUser(),Arrays.asList("role", "dept"));
			constructerVOs.add(constructerV);
		}
		
		return constructerVOs;
	}

	@Override
	public List<ConstructerVO> queryConstructerByCid(ConstructerVO constructerVO) {
		
		long cid = constructerVO.getCid();
		Integer schedule = constructerVO.getSchedule();
		
		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByCid(cid,schedule);
		List<ConstructerVO> constructerVOs = new ArrayList<ConstructerVO>();
		
		for (ConstructerPO constructerPO : constructerPOs) {
			ConstructerVO constructerV = new ConstructerVO(new UserVO());
			BeanUtil.copyProperties(constructerPO, constructerV,Arrays.asList("user","creater"));
			BeanUtil.copyProperties(constructerPO.getUser(), constructerV.getUser(),Arrays.asList("role", "dept"));
			constructerVOs.add(constructerV);
		}
		
		return constructerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addConstructer(ConstructerVO constructerVO, String createrId) throws FLException {
		//判断工程是否存在
		long constructionId = constructerVO.getCid();
		ConstructionPO constructionPO = constructionDao.queryConstructionByCid(constructionId);

		if(constructionPO == null){
			throw new FLException(120020, "工程信息不存在");
		}
		
		long cid = constructerVO.getCid();
		String userId = constructerVO.getUser().getUserId();
		int schedule = constructerVO.getSchedule();
		
		if(constructerDao.countConstructer(cid, userId, schedule,ConstructerPO.STATUS_ENABLE_SHORT) > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		UserPO userPO = userDao.queryUserByUserId(constructerVO.getUser().getUserId());
		UserPO userC = userDao.queryUserByUserId(createrId);
		
		if(userPO == null){
			throw new FLException(220005,"员工不存在");
		}
		
		ConstructerPO constructerPO = new ConstructerPO(userPO, userC);
		BeanUtil.copyProperties(constructerVO, constructerPO, Arrays.asList("user", "creater"));
		BeanUtil.copyProperties(userPO, constructerPO.getUser(), Arrays.asList("role", "dept"));
		constructerPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		constructerPO.setOrderId(constructionPO.getDecorationOrderPO().getOrderId());
		constructerDao.save(constructerPO);
		constructerVO.setCrid(constructerPO.getCrid());
		constructerVO.setUser(new UserVO().setBaseInfo(userPO));
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateConstructerForRate(ConstructerVO constructerVO) throws FLException{
		
		ConstructerPO constructerPO = constructerDao.queryConstructerByCrId(constructerVO.getCrid());

		if(constructerPO == null){
			throw new FLException(120021, "施工人员不存在");
		}

		short rate = constructerVO.getRate();
		constructerPO.setRate(rate);
		constructerPO.setAssessment(constructerVO.getAssessment());

		constructerDao.update(constructerPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteConstructer(ConstructerVO constructerVO) throws FLException {
		long crid = constructerVO.getCrid();
		ConstructerPO constructerPO = constructerDao.queryConstructerByCrId(crid);

		if(constructerPO == null){
			throw new FLException(120021, "施工人员不存在");
		}

		Long cid = Long.valueOf(constructerPO.getCid());
		String userId = constructerPO.getUser().getUserId();

		Integer workerSalaryCount = workerSalaryDao.countWorkerSalary(cid,userId);

		if(workerSalaryCount > 0){
			throw new FLException(120023, "施工人员存在工费,不可删除");
		}

		constructerPO.setStatus(ConstructerPO.STATUS_DISABLE_SHORT);
		constructerDao.update(constructerPO);
	}
	
}
