/**
 * @File Name		: PutlineConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.DecorationOrderDrawLineDao;
import com.fanglin.construction.dao.PutlineConstructionScheduleDao;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.DecorationOrderDrawLinePO;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.service.PutlineConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.PutlineConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.information.dao.MessageDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("putlineConstructionScheduleService")
@Transactional(readOnly=true)
public class PutlineConstructionScheduleServiceImpl implements PutlineConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private PutlineConstructionScheduleDao putlineConstructionScheduleDao;
	
	@Autowired
	private DecorationOrderDrawLineDao decorationOrderDrawLineDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private MessageDao messageDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public PutlineConstructionScheduleVO queryPutlineConstructionScheduleById(int pcsId){
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(pcsId);
		PutlineConstructionScheduleVO putlineConstructionScheduleVO = new PutlineConstructionScheduleVO();
		
		BeanUtil.copyProperties(putlineConstructionSchedulePO, putlineConstructionScheduleVO, Arrays.asList("decorationOrder"));
		putlineConstructionScheduleVO.setOrderId(putlineConstructionSchedulePO.getDecorationOrder().getOrderId());
		
		return putlineConstructionScheduleVO;
	}

	@Override
	public PutlineConstructionScheduleVO queryPutlineConstructionScheduleByOrderId(PutlineConstructionScheduleVO putlineConstructionScheduleVO){
		
		if(putlineConstructionScheduleVO == null){
			return null;
		}
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByOrderId(putlineConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(putlineConstructionSchedulePO, putlineConstructionScheduleVO, Arrays.asList("decorationOrder"));
		putlineConstructionScheduleVO.setOrderId(putlineConstructionSchedulePO.getDecorationOrder().getOrderId());
		
		String workerId = putlineConstructionSchedulePO.getWorkerId();
		
		if(workerId != null && !"".equals(workerId)){
			UserPO userPO = userDao.get(workerId);
			
			if(userPO != null){
				putlineConstructionScheduleVO.setWorkerName(userPO.getCurrentName());
				putlineConstructionScheduleVO.setWorkerOldId(userPO.getOldUserId());
				putlineConstructionScheduleVO.setWorkerDuty(userPO.getDuty());
				putlineConstructionScheduleVO.setWorkerPhone(userPO.getPhone());
				putlineConstructionScheduleVO.setWorkerPhoto(userPO.getUserPhoto());
			}
		}
		
		return putlineConstructionScheduleVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdatePutlineConstructionSchedule(PutlineConstructionScheduleVO putlineConstructionScheduleVO){
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByOrderId(putlineConstructionScheduleVO.getOrderId());
		
		if(putlineConstructionSchedulePO == null){
			putlineConstructionSchedulePO = new	PutlineConstructionSchedulePO();
			putlineConstructionSchedulePO.setStartTime(DateUtil.current(PutlineConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			putlineConstructionSchedulePO.setEndTime(DateUtil.current(PutlineConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			putlineConstructionSchedulePO.setPutlineTime(DateUtil.current(PutlineConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(putlineConstructionScheduleVO, putlineConstructionSchedulePO, Arrays.asList("orderId"));
		DecorationOrderPO order = new DecorationOrderPO();
		order.setOrderId(putlineConstructionScheduleVO.getOrderId());
		putlineConstructionSchedulePO.setDecorationOrder(order);
		putlineConstructionScheduleDao.saveOrUpdate(putlineConstructionSchedulePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setPutlineConstructionScheduleForStatus(PutlineConstructionScheduleVO putlineConstructionScheduleVO, String userId){
		
		int putlineStatus = putlineConstructionScheduleVO.getPutlineStatus();
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(putlineConstructionScheduleVO.getPlcsId());
		
		if(putlineConstructionSchedulePO != null){
			putlineConstructionSchedulePO.setPutlineStatus(putlineStatus);
			
			List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLineByOrderId(putlineConstructionSchedulePO.getDecorationOrder().getOrderId());
				
			if(decorationOrderDrawLinePOs != null && decorationOrderDrawLinePOs.size() > 0){
				
				DecorationOrderPO decorationOrderPO = putlineConstructionSchedulePO.getDecorationOrder();
				DecorationOrderDrawLinePO decorationOrderDrawLinePO = decorationOrderDrawLinePOs.get(0);
				
				if(putlineConstructionScheduleVO.getPutlineStatus() == PutlineConstructionSchedulePO.PUTLINESTATUS_TYPE_SUCCESS_INT){
					decorationOrderDrawLinePO.setStatus("放线成功");
					
					List<String> dutys = new ArrayList<String>();
					dutys.add("前台咨询师");
					List<UserPO> userPOs = userDao.queryUserByDutys(dutys);
					
					for(UserPO userPO: userPOs){
						
						MessagePO messagePO = new MessagePO();
						messagePO.setSender(new UserPO(userId));
						messagePO.setReceiver(userPO);
						messagePO.setType("施工进度消息");
						messagePO.setContents(String.format("装修订单编号:%s,放线进度已经结束,请尽快回访客户!", decorationOrderPO.getOrderId()));
						messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
						messagePO.setStatus("未读");
						messagePO.setArgs("");
						messageDao.saveOrUpdate(messagePO);
					}
				}else if(putlineConstructionScheduleVO.getPutlineStatus() == PutlineConstructionSchedulePO.PUTLINESTATUS_TYPE_FAIL_INT){
					decorationOrderDrawLinePO.setStatus("放线失败");
					
					ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(decorationOrderPO.getOrderId());
					
					MessagePO messagePO = new MessagePO();
					messagePO.setSender(new UserPO(constructionSchedulePO.getPutlineQualityId()));
					messagePO.setReceiver(decorationOrderPO.getDesignerPO());
					messagePO.setType("放线消息");
					messagePO.setContents(String.format("装修订单编号:%s,放线失败!", decorationOrderPO.getOrderId()));
					messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					messagePO.setStatus("未读");
					messagePO.setArgs("");
					
					messageDao.saveOrUpdate(messagePO);
				}
				
				decorationOrderDrawLineDao.update(decorationOrderDrawLinePO);
			}
			
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setPutlineConstructionScheduleForInfo(PutlineConstructionScheduleVO putlineConstructionScheduleVO){
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(putlineConstructionScheduleVO.getPlcsId());
		
		if(putlineConstructionSchedulePO != null){
			putlineConstructionSchedulePO.setPutlineTime(putlineConstructionScheduleVO.getPutlineTime());
			
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setPutlineConstructionScheduleWorker(PutlineConstructionScheduleVO putlineConstructionScheduleVO) throws FLException{
		
		int plcsId = putlineConstructionScheduleVO.getPlcsId();
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(plcsId);
		
		if(putlineConstructionSchedulePO != null){
			
			String workerId = putlineConstructionScheduleVO.getWorkerId();
			
			if("".equals(workerId)){
				WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(plcsId, ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				
				List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
				
				if(workerBaseSalaryPO != null){
					if(!status.contains(workerBaseSalaryPO.getStatus())){
						throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
					}else{
						workerBaseSalaryDao.delete(workerBaseSalaryPO);
					}
				}
				
				putlineConstructionSchedulePO.setWorkerId("");
				putlineConstructionSchedulePO.setAllocateTime(null);
			}else{
				putlineConstructionSchedulePO.setWorkerId(workerId);
				putlineConstructionSchedulePO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
				
				ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(putlineConstructionSchedulePO.getCsId());
				if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & PutlineConstructionSchedulePO.PUBLINE_ALLOCATION_WORKER_FLAG_INT) != 0){
					constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + PutlineConstructionSchedulePO.PUBLINE_ALLOCATION_WORKER_FLAG_INT);
					
					constructionScheduleDao.update(constructionSchedulePO);
				}
				
				UserPO userPO = userDao.get(workerId);
				if(userPO != null){
					putlineConstructionScheduleVO.setWorkerOldId(userPO.getOldUserId());
					putlineConstructionScheduleVO.setWorkerName(userPO.getCurrentName());
					putlineConstructionScheduleVO.setWorkerDuty(userPO.getDuty());
					putlineConstructionScheduleVO.setWorkerPhoto(userPO.getUserPhoto());
				}
			}
			
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setPutlineConstructionScheduleForService(PutlineConstructionScheduleVO putlineConstructionScheduleVO){
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(putlineConstructionScheduleVO.getPlcsId());
		
		putlineConstructionSchedulePO.setWorkerRaty(putlineConstructionScheduleVO.getWorkerRaty());
		putlineConstructionSchedulePO.setWorkerRatyDes(putlineConstructionScheduleVO.getWorkerRatyDes());
		
		putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setPutlineConstructionScheduleForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int plcsId = constructionScheduleWorkerVO.getPcsId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.get(plcsId);
		
		if(putlineConstructionSchedulePO != null){
			
			putlineConstructionSchedulePO.setWorkerSalary(workerSalary);
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(plcsId, PutlineConstructionSchedulePO.PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				
				BeanUtil.copyProperties(putlineConstructionSchedulePO, workerBaseSalaryPO, Arrays.asList("decorationOrder"));
				workerBaseSalaryPO.setOrderId(putlineConstructionSchedulePO.getDecorationOrder().getOrderId());
				workerBaseSalaryPO.setCswId(plcsId);
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				workerBaseSalaryPO.setWorkTypeId(PutlineConstructionSchedulePO.PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				workerBaseSalaryPO.setWorkType(PutlineConstructionSchedulePO.PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}
		
		return 0;
	}

}
