package com.fanglin.information.service.impl;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.PlanDao;
import com.fanglin.information.dao.TaskDao;
import com.fanglin.information.po.PlanPO;
import com.fanglin.information.po.TaskPO;
import com.fanglin.information.service.PlanService;
import com.fanglin.information.vo.PlanVO;
import com.fanglin.information.vo.TaskVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("planService")
@Transactional(readOnly = true)
public class PlanServiceImpl implements PlanService{

	@Autowired
	private PlanDao planDao;

	@Autowired
	private TaskDao taskDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pagePlan(Paging paging, List<Filter> filters) {
		
		List<PlanPO> planPOs = planDao.pagePlan(paging, filters);
		
		List<PlanVO> planVOs = new ArrayList<PlanVO>();
		
		for(PlanPO planPO : planPOs){
			
			PlanVO planVO = new PlanVO(new TaskVO());
			
			BeanUtil.copyPropertie(planPO, planVO,Arrays.asList("task", "creater"));
			BeanUtil.copyPropertie(planPO.getTask(), planVO.getTask());
			
			planVOs.add(planVO);
		}
		
		paging.setData(planVOs);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createPlan(PlanVO planVO,String userId) throws FLException, ParseException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);

		int count = planDao.countPlanByCuid(userPO.getUid());
		
		if(count > 3){
			throw new FLException(160030, "未执行任务达到上限");
		}
		
		TaskPO taskPO = taskDao.get(planVO.getTask().getTid());
		
		if(taskPO == null){
			throw new FLException(160029, "计划不可操作");
		}
		
		PlanPO planPO = new PlanPO();
		
        int planNum = 0;
		
		if (planVO.getExecuteTime() != null) {
		
			String executeTime = DateUtil.getDateToDateString(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(planVO.getExecuteTime()),"yyMMddHHmm");
			
            planNum = planDao.countPlanByExecuteTime(executeTime);
            
			if(planNum <= 50){
				planPO.setExecuteTime(executeTime);
			}else {
				throw new FLException(160030, "未执行任务达到上限");
			}
         }else{
        	  planNum = planDao.countPlanRightNow();
        	  if(planNum > 50){
		    	   throw new FLException(160030, "未执行任务达到上限");
  			}
		}
		
		planPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		planPO.setTask(taskPO);
		
		planPO.setCuid(userPO.getUid());
		
		planPO.setArgs(planVO.getArgs());
		
		planPO.setStatus(PlanPO.COLUMN_STATUS_INT);

		planDao.save(planPO);
		
		Process process = null;
		
		 try {
		    if (planVO.getExecuteTime() == null) {
		    	
		    	String commond = "";
		    	
		    	 if(taskPO.getType() == 0){
		             commond =String.format( "python %s %s %s %s", taskPO.getFilepath(),planPO.getPid(), planPO.getArgs() , " &");
		           }else{
		             commond =String.format("sh %s %s %s %s" ,taskPO.getFilepath(),planPO.getPid(), planPO.getArgs() , " &");
		             
		           }
		      
		    	process = Runtime.getRuntime().exec(commond);
		      
		    	if (process != null) {
		    	  process.destroy();
		      }
		    }
		 } catch (IOException e) {
			 throw new FLException(160029, "计划不可操作");
		}

		return 0;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePlan(PlanVO planVO,String userId) throws FLException, ParseException {
		 
		PlanPO planPO = planDao.get(planVO.getPid());
		
		if (planPO == null) {
			throw new FLException(130015, "计划不存在");
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO.getUid() != planPO.getCuid()){
			throw new FLException(160029, "计划不可操作");
		}
		
		TaskPO taskPO = taskDao.get(planVO.getTask().getTid());
		
		if(taskPO == null){
			throw new FLException(160029, "计划不可操作");
		}
		
		int planNum = 0;
		
		if (planVO.getExecuteTime() != null) {
		
			String executeTime = DateUtil.getDateToDateString(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(planVO.getExecuteTime()),"yyMMddHHmm");
			
			if(executeTime != planPO.getExecuteTime()){
				planNum = planDao.countPlanByExecuteTime(executeTime);
	            
				if(planNum <= 1){
					planPO.setExecuteTime(executeTime);
				}else {
					throw new FLException(160030, "未执行任务达到上限");
				}
			}
            
         }else{
        	  planNum = planDao.countPlanRightNow();
        	  if(planNum >1){
		    	   throw new FLException(160030, "未执行任务达到上限");
  			}
        	  planPO.setExecuteTime(planVO.getExecuteTime());
		}
		planPO.setTask(taskPO);
		
		planPO.setArgs(planVO.getArgs());
		
		planDao.update(planPO);
		
		Process process = null;
		
		 try {
		    if (planVO.getExecuteTime() == null) {
		    	
		    	String commond = "";
		    	
		    	 if(taskPO.getType() == 0){
		             commond =String.format( "python %s %s %s %s", taskPO.getFilepath(),planPO.getPid(), planPO.getArgs() , " &");
		           }else{
		             commond =String.format("sh %s %s %s %s" ,taskPO.getFilepath(),planPO.getPid(), planPO.getArgs() , " &");
		             
		           }
		      
		    	process = Runtime.getRuntime().exec(commond);
		      
		    	if (process != null) {
		    	  process.destroy();
		      }
		    }
		 } catch (IOException e) {
			 throw new FLException(160029, "计划不可操作");
		}
		

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelPlan(PlanVO planVO,String userId) throws FLException {
		
		PlanPO planPO = planDao.get(planVO.getPid());
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(planPO == null){
			throw new FLException(160028, "计划不存在");
		}
		if(userPO.getUid() != planPO.getCuid()){
			throw new FLException(160029, "计划不可操作");
		}
		if(planPO.getStatus() != 0){
			throw new FLException(160029, "计划不可操作");
		}
		planPO.setStatus(PlanPO.COLUMN_STATUS_CANCEL_INT);
		
		planDao.update(planPO);
		
		return 0;
	}

	
	
}
