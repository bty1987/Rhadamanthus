package com.fanglin.information.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VticketPO;
import com.fanglin.information.service.VticketService;
import com.fanglin.information.vo.VticketVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vticketService")
@Transactional(readOnly=true)
public class VticketServiceImpl implements VticketService {
	
	@Autowired
	private VticketDao vticketDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageVticket(Paging paging, List<Filter> filters) {
		
		List<VticketPO> vticketPOs = vticketDao.pageVticket(paging, filters);
		List<VticketVO> vticketVOs = new ArrayList<VticketVO>();
		
		for (VticketPO vticketPO : vticketPOs) {
			
			vticketVOs.add(vticketPOToVO(vticketPO));
			
		}
		
		paging.setData(vticketVOs);
		
	}
	
	@Override
	public void pageVticketForBelonger(Paging paging, List<Filter> filters, String userId) {
		
		UserPO belonge = userDao.queryUserByUserId(userId);
		
		Filter filter = new Filter();
		filter.setData(String.valueOf(belonge.getUid()));
		filter.setField(VticketPO.COLUMN_BELONGER_STR);
		filter.setOp("eq");
		filters.add(filter);
		
		List<VticketPO> vticketPOs = vticketDao.pageVticket(paging, filters);
		List<VticketVO> vticketVOs = new ArrayList<VticketVO>();
		
		for (VticketPO vticketPO : vticketPOs) {
			
			vticketVOs.add(vticketPOToVO(vticketPO));
			
		}
		
		paging.setData(vticketVOs);
		
	}

	@Override
	public List<?> countVticket(short param) {
		
		List<?> counts = vticketDao.countVticket(param);
		
		return counts;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void createVticket(VticketVO vticketVO, String userId) throws FLException {
		
		if(!vticketVO.getOrderId().equals("")){
			
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(vticketVO.getOrderId());
			
			if(decorationPO == null) throw new FLException(140013, "装修订单不存在");
			
		}
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		UserPO belonger = userDao.queryUserByUserId(vticketVO.getBelonger().getUserId());
		
		VticketPO vticketPO = new VticketPO(creater, belonger, belonger.getDept(), belonger.getDept().getFatherDept());
		
		BeanUtil.copyProperties(vticketVO, vticketPO, Arrays.asList("creater", "belonger", "department", "region"));
		
		vticketPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		vticketDao.save(vticketPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateVticket(VticketVO vticketVO) throws FLException {
		
		if(vticketVO.getVtid() == null) throw new FLException(160026, "活动票不存在");
		
		VticketPO vticketPO = vticketDao.queryVticketByVtid(vticketVO.getVtid());
		
		UserPO belonger = userDao.queryUserByUserId(vticketVO.getBelonger().getUserId());
		
		vticketPO.setBelonger(belonger);
		
		vticketPO.setDepartment(belonger.getDept());
		
		vticketPO.setRegion(belonger.getDept().getFatherDept());
		
		vticketPO.setOrderId(vticketVO.getOrderId());
		
		vticketPO.setName(vticketVO.getName());
		
		vticketPO.setPhone(vticketVO.getPhone());
		
		vticketPO.setAddress(vticketVO.getAddress());
		
		vticketDao.update(vticketPO);

	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void comeVticket(VticketVO vticketVO) throws FLException  {
		
		VticketPO vticketPO = vticketDao.queryVticketByTno(vticketVO.getTno());
		
		if(vticketPO == null ){
			throw new FLException(160026, "活动票不存在");
		}
		
		if(vticketPO.getIscome() ==  VticketPO.ISCOME_YES_INT){
			throw new FLException(160027, "活动票已到场");
		}
		
		vticketPO.setIscome(VticketPO.ISCOME_YES_INT);
		
		vticketDao.update(vticketPO);
		
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void registVticket(VticketVO vticketVO) {
		
		VticketPO vticketPO = vticketDao.queryVticketByTno(vticketVO.getTno());
		
		if(vticketPO != null){
			vticketPO.setIsregist(VticketPO.ISREGIST_YES_INT);
			
			vticketDao.update(vticketPO);
		}
	}

	public VticketVO vticketPOToVO(VticketPO vticketPO){
		
		VticketVO vticketVO = new VticketVO(new UserVO(), new UserVO(), new DepartmentVO(), new DepartmentVO());
		
		BeanUtil.copyProperties(vticketPO, vticketVO, Arrays.asList("creater", "belonger", "department", "region"));
		
		BeanUtil.copyProperties(vticketPO.getCreater(), vticketVO.getCreater(), Arrays.asList("role", "dept", "duty"));
		
		BeanUtil.copyProperties(vticketPO.getBelonger(), vticketVO.getBelonger(), Arrays.asList("role", "dept", "duty"));
		
		BeanUtil.copyProperties(vticketPO.getDepartment(), vticketVO.getDepartment(), Arrays.asList("type", "fatherDept", "cityProper"));
		
		BeanUtil.copyProperties(vticketPO.getRegion(), vticketVO.getRegion(), Arrays.asList("type", "fatherDept", "cityProper"));
		
		return vticketVO;
	}

	

}
