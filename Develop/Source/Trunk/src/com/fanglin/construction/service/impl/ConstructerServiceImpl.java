package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructerService;
import com.fanglin.construction.vo.ConstructerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("constructerService")
@Transactional(readOnly=true)
public class ConstructerServiceImpl implements ConstructerService {

	@Autowired
	private ConstructerDao constructerDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Override
	public List<ConstructerVO> queryConstructerByOrderId(ConstructerVO constructerVO) {
//		通过订单编号获取施工人员信息 , 同时可以利用schedule获取具体施工环节人员信息
//		如果schedule没有传值将返回订单编号对应的所有施工人员信息
		String orderId = constructerVO.getOrderId();
		Integer schedule = constructerVO.getSchedule();
		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByOrderId(orderId,schedule);
		 
		List<ConstructerVO> constructerVOs = new ArrayList<ConstructerVO>();
		for (ConstructerPO constructerPO : constructerPOs) {
			ConstructerVO constructerV = new ConstructerVO(new UserVO(),new UserVO());
			BeanUtil.copyProperties(constructerPO, constructerV,Arrays.asList("user","creater"));
			BeanUtil.copyProperties(constructerPO.getUser(), constructerV.getUser(),Arrays.asList("role","dept"));
			constructerVOs.add(constructerV);
		}
		return constructerVOs;
	}

	@Override
	public List<ConstructerVO> queryConstructerByCsId(ConstructerVO constructerVO) {
		Integer csId = constructerVO.getCsId();
		Integer schedule = constructerVO.getSchedule();
		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByCsId(csId,schedule);
		List<ConstructerVO> constructerVOs = new ArrayList<ConstructerVO>();
		for (ConstructerPO constructerPO : constructerPOs) {
			ConstructerVO constructerV = new ConstructerVO(new UserVO());
			BeanUtil.copyProperties(constructerPO, constructerV,Arrays.asList("user","creater"));
			BeanUtil.copyProperties(constructerPO.getUser(), constructerV.getUser(),Arrays.asList("role","dept"));
			constructerVOs.add(constructerV);
		}
		return constructerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addConstructer(ConstructerVO constructerVO, String createrId) throws FLException {
		//判断工程是否存在
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCsId(constructerVO.getCsId());
		//根据工程id查询工程下的施工人员
		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByCsId(constructerVO.getCsId(), constructerVO.getSchedule());

		if(constructionSchedulePO != null){
			if(constructerPOs.size() == 0){
				ConstructerPO constructerP = new ConstructerPO(new UserPO(),new UserPO());
				BeanUtil.copyProperties(constructerVO, constructerP, Arrays.asList("user"));
				BeanUtil.copyProperties(constructerVO.getUser(), constructerP.getUser(), Arrays.asList("dept","role"));
				UserPO u = userDao.get(createrId);
				BeanUtil.copyProperties(u, constructerP.getCreater(), Arrays.asList("dept","role"));
				constructerP.setCreateTime(new Timestamp(System.currentTimeMillis()));
				constructerP.setOrderId(constructionSchedulePO.getDecorationOrderPO().getOrderId());
				constructerDao.save(constructerP);
			}else{
				List<String> slist = null;
				for(ConstructerPO constructerPO : constructerPOs){
					String userId = constructerPO.getUser().getUserId();
					slist = new ArrayList<String>();
					slist.add(userId);
				}
				if(!slist.contains(constructerVO.getUser().getUserId())){
					ConstructerPO constructerP = new ConstructerPO(new UserPO(),new UserPO());
					BeanUtil.copyProperties(constructerVO, constructerP, Arrays.asList("user"));
					BeanUtil.copyProperties(constructerVO.getUser(), constructerP.getUser(), Arrays.asList("dept","role"));
					UserPO u = userDao.get(createrId);
					BeanUtil.copyProperties(u, constructerP.getCreater(), Arrays.asList("dept","role"));
					constructerP.setCreateTime(new Timestamp(System.currentTimeMillis()));
					constructerP.setOrderId(constructionSchedulePO.getDecorationOrderPO().getOrderId());
					constructerDao.save(constructerP);
				}else{
					throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
				}
				
			}
		
		}else{
			throw new FLException(120020, "工程信息不存在");
		}	
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateConstructerForSalary(ConstructerVO constructerVO) throws FLException{
		ConstructerPO constructerPO = constructerDao.queryConstructerByCid(constructerVO.getCid());
		if(constructerPO != null){
			if(constructerPO.getStatus() == 0){
				constructerPO.setSalary(constructerVO.getSalary());
				constructerDao.update(constructerPO);
			}else{
				throw new FLException(120022, "施工人员状态不可操作");
			}
		}else{
			throw new FLException(120021, "施工人员不存在");
		}
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateConstructerForRate(ConstructerVO constructerVO) throws FLException{
		ConstructerPO constructerPO = constructerDao.queryConstructerByCid(constructerVO.getCid());
		if(constructerPO != null){
			constructerPO.setRate(constructerVO.getRate());
			constructerPO.setAssessment(constructerVO.getAssessment());
			constructerDao.update(constructerPO);
		}else{
			throw new FLException(120021, "施工人员不存在");
		}
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteConstructer(ConstructerVO constructerVO) {
		ConstructerPO constructerPO = constructerDao.queryConstructerByCid(constructerVO.getCid());
		if(constructerPO != null){
			constructerPO.setStatus((short) 1);
			constructerDao.update(constructerPO);
		}
		
	}

}
