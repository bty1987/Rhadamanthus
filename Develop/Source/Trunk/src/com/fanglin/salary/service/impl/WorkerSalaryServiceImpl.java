package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workerSalaryService")
@Transactional(readOnly = true)
public class WorkerSalaryServiceImpl implements WorkerSalaryService {

	@Autowired
	private WorkerSalaryDao workerSalaryDao;
	
	
	@Autowired
	private UserDao userdao;

	@Autowired
	private ConstructionDao constructionDao;
	
	
	@Override
	public void pageWorkerSalary(Paging paging, List<Filter> filters) {
	
		
		List<WorkerSalaryPO> WorkerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging,filters);
		List<WorkerSalaryVO> WorkerSalaryVOs = new ArrayList<WorkerSalaryVO>();
		
		for (WorkerSalaryPO workerSalaryPO : WorkerSalaryPOs) {
			WorkerSalaryVO workerSalaryVO = new WorkerSalaryVO(new DecorationOrderVO(),new UserVO(),new UserVO(),new UserVO());
			
			if(workerSalaryPO.getApprover()!=null){
				
				workerSalaryVO.getApprover().setUserName(workerSalaryPO.getApprover().getUserName());
			
			}
			workerSalaryVO.getCreater().setUserName(workerSalaryPO.getCreater().getUserName());
			
			if(workerSalaryPO.getDecorationOrder() != null){
				
				workerSalaryVO.getDecorationOrder().setOrderId(workerSalaryPO.getDecorationOrder().getOrderId());
				workerSalaryVO.getDecorationOrder().setHouseNumber(workerSalaryPO.getDecorationOrder().getHouseNumber());
				if(workerSalaryPO.getDecorationOrder().getVillagePO() != null){
					
					VillageVO villageVO = new VillageVO();
					villageVO.setVillageName(workerSalaryPO.getDecorationOrder().getVillagePO().getVillageName());
					workerSalaryVO.getDecorationOrder().setVillage(villageVO);
				}
				if(workerSalaryPO.getDecorationOrder().getSupervisorPO() != null){
					
					workerSalaryVO.getDecorationOrder().setSupervisor(workerSalaryPO.getDecorationOrder().getSupervisorPO().getUserName());
				}

			}
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO, Arrays.asList("decorationOrder","user","creater","approver"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(), workerSalaryVO.getUser(),Arrays.asList("dept", "role"));
			WorkerSalaryVOs.add(workerSalaryVO);
			
			
		}
		paging.setData(WorkerSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<WorkerSalaryVO> queryWorkerSalary(WorkerSalaryVO workerSalaryVO) {
		
		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.queryWorkerSalary(workerSalaryVO.getUser().getUserId(),workerSalaryVO.getCid());
		List<WorkerSalaryVO> workerSalarys = new ArrayList<WorkerSalaryVO>();
		
		for (WorkerSalaryPO workerSalaryPO : workerSalaryPOs) {
			WorkerSalaryVO workerSalaryvo = new WorkerSalaryVO(new DecorationOrderVO(),new UserVO(),new UserVO(),new UserVO() );
			
			
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryvo,Arrays.asList("user","decorationOrder","creater","approver"));
			BeanUtil.copyProperties(workerSalaryPO.getUser(),workerSalaryvo.getUser(), Arrays.asList("dept", "role"));
			workerSalarys.add(workerSalaryvo);
		}
		return workerSalarys;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addWorkerSalary(WorkerSalaryVO workerSalaryVO,String userId) throws FLException {
		UserPO user = userdao.queryUserByUserId(workerSalaryVO.getUser().getUserId());
		UserPO	userpo = userdao.queryUserByUserId(userId);
		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO(new DecorationOrderPO(), user,userpo);
		if(workerSalaryVO.getCid() != null){
			long cid = workerSalaryVO.getCid();
			ConstructionPO	 constructionPO =constructionDao.queryConstructionByCid(cid);
			
		    if (constructionPO == null) {
			      throw new FLException(120020, "工程信息不存在");
			    }
		   
		 workerSalaryPO.getDecorationOrder().setOrderId(constructionPO.getDecorationOrderPO().getOrderId());
		    workerSalaryPO.setCid(cid);
		}else{
			
		    workerSalaryPO.setCid(WorkerSalaryPO.CSID_INIT_STR);
		}
		workerSalaryPO.setSubtype(workerSalaryVO.getSubtype());
		workerSalaryPO.setComment(workerSalaryVO.getComment());
	    workerSalaryPO.setType(workerSalaryVO.getType());
	    workerSalaryPO.setSalary(workerSalaryVO.getSalary());
	    workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
	    workerSalaryPO.setBalanceTime(new Timestamp(System.currentTimeMillis()));
	    workerSalaryDao.save(workerSalaryPO);
	    
	    workerSalaryVO.setCreateTime(workerSalaryPO.getCreateTime());
	    workerSalaryVO.setStatus(workerSalaryPO.getStatus());
		workerSalaryVO.setSubtype(workerSalaryPO.getSubtype());
		workerSalaryVO.setWsId(workerSalaryPO.getWsId());
		
}
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {
		
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkSalaryByWsId(workerSalaryVO.getWsId());
		
		if (workerSalaryPO == null) {
			throw new FLException(280001, "薪资信息不存在");
		}
		if (workerSalaryPO.getStatus() != WorkerSalaryPO.STATUS_INIT_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}
		
		BeanUtil.copyProperties(workerSalaryVO, workerSalaryPO,Arrays.asList("user"));
		BeanUtil.copyProperties(workerSalaryVO.getUser(),workerSalaryPO.getUser(), Arrays.asList("dept", "role"));
		workerSalaryDao.update(workerSalaryPO);
		
		return 0;
	}

	

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int adoptWorkerSalary(List<WorkerSalaryVO> workerSalarys,String userId)  throws FLException{
			
		UserPO approval = userdao.queryUserByUserId(userId);
		for (WorkerSalaryVO workerSalaryVO : workerSalarys) {
		
		WorkerSalaryPO	workerSalaryPO=	workerSalaryDao.get(workerSalaryVO.getWsId());
		if(workerSalaryPO.getStatus()!=WorkerSalaryPO.STATUS_INIT_STR){
			throw new FLException(280002, "工费状态不可操作");
		}
		workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_STRONE);
		workerSalaryPO.setApprover(approval);
		}
		
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int rejectWorkerSalary(List<WorkerSalaryVO> workerSalarys,String userId)  throws FLException{
			
		UserPO approval = userdao.queryUserByUserId(userId);
		for (WorkerSalaryVO workerSalaryVO : workerSalarys) {
		
		WorkerSalaryPO	workerSalaryPO=	workerSalaryDao.get(workerSalaryVO.getWsId());
		if(workerSalaryPO.getStatus()!=WorkerSalaryPO.STATUS_INIT_STR){
			throw new FLException(280002, "工费状态不可操作");
		}
		workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));
		workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_STRTWO);
		workerSalaryPO.setApprover(approval);
		}
		
		
		return 0;
	}
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException {
		
		WorkerSalaryPO worksalarypo = workerSalaryDao.queryWorkSalaryByWsId(workerSalaryVO.getWsId());
		
		if (worksalarypo == null) {
			throw new FLException(280001, "薪资信息不存在");
		}
		if (worksalarypo.getStatus() != WorkerSalaryPO.STATUS_INIT_STR) {
			throw new FLException(280002, "工费状态不可操作");
		}
		
		workerSalaryDao.delete(worksalarypo);
	}


}
