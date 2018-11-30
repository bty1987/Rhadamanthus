package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationCircleDao;
import com.fanglin.customer.dao.DecorationCirclePictureDao;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.po.DecorationCirclePO;
import com.fanglin.customer.po.DecorationCirclePicturePO;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.DecorationCircleService;
import com.fanglin.customer.vo.DecorationCirclePictureVO;
import com.fanglin.customer.vo.DecorationCircleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationCircleService")
@Transactional(readOnly=true)
public class DecorationCircleServiceImpl implements DecorationCircleService{
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private DecorationCircleDao decorationCircleDao;
	
	@Autowired
	private DecorationCirclePictureDao decorationCirclePictureDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<DecorationCircleVO> queryDecorationCircle(List<DecorationCircleVO> decorationCircleVOs,List<DecorationCirclePO> decorationCirclePOs) {
		
		if(decorationCirclePOs != null && decorationCirclePOs.size() != 0){
			
			for(DecorationCirclePO decorationCirclePO : decorationCirclePOs){
				
				DecorationCircleVO decorationCircleVO = new DecorationCircleVO(new UserBaseVO(new DutyVO()));
				
				BeanUtil.copyPropertie(decorationCirclePO, decorationCircleVO, Arrays.asList("creater","decorationCirclePictures"));
				BeanUtil.copyPropertie(decorationCirclePO.getCreater(), decorationCircleVO.getCreater(), Arrays.asList("dept","duty"));
				BeanUtil.copyPropertie(decorationCirclePO.getCreater().getDuty(), decorationCircleVO.getCreater().getDuty(), Arrays.asList("departmentType"));
				
				List<DecorationCirclePicturePO> decorationCirclePicturePOs = decorationCirclePictureDao.queryDecorationCirclePictureByDcid(decorationCirclePO.getDcid());
				List<DecorationCirclePictureVO> decorationCirclePictureVOs = new ArrayList<DecorationCirclePictureVO>();
				
				if(decorationCirclePicturePOs != null && decorationCirclePicturePOs.size() != 0){
					
					for(DecorationCirclePicturePO decorationCirclePicturePO : decorationCirclePicturePOs){
						
						DecorationCirclePictureVO decorationCirclePictureVO = new DecorationCirclePictureVO();
						
						BeanUtil.copyPropertie(decorationCirclePicturePO, decorationCirclePictureVO);
						
						decorationCirclePictureVOs.add(decorationCirclePictureVO);
						
					}
					
				}
				
				decorationCircleVO.setDecorationCirclePictures(decorationCirclePictureVOs);
				
				decorationCircleVOs.add(decorationCircleVO);
				
			}
		}
		
		return decorationCircleVOs;
	}

	@Override
	public void queryDecorationCircleByUnionId(Paging paging,List<Filter> filters,String unionId) {
		
		List<DecorationPO> decorationPOs = decorationDao.queryCusDecoration(unionId);
		List<String> orderIds = new ArrayList<String>();
		
		for(DecorationPO decorationPO : decorationPOs){
			orderIds.add(decorationPO.getOrderId());
		}
		
		List<DecorationCircleVO> decorationCircleVOs = new ArrayList<DecorationCircleVO>(); 
		
		if(orderIds.size() != 0){
			
			List<DecorationCirclePO> decorationCirclePOs = decorationCircleDao.queryDecorationCircleByOrderIds(paging,filters,orderIds);
			
			decorationCircleVOs = queryDecorationCircle(decorationCircleVOs, decorationCirclePOs);
			
		}
		
		paging.setData(decorationCircleVOs);
	}

	@Override
	public void queryDecorationCircleByOrderId(Paging paging,List<Filter> filters,DecorationCircleVO decorationCircleVO) {
		
		List<DecorationCirclePO> decorationCirclePOs = decorationCircleDao.queryDecorationCircleByOrderId(paging,filters,decorationCircleVO.getOrderId());
		List<DecorationCircleVO> decorationCircleVOs = new ArrayList<DecorationCircleVO>();
		
		decorationCircleVOs = queryDecorationCircle(decorationCircleVOs, decorationCirclePOs);
		
		paging.setData(decorationCircleVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addDecorationCircle(DecorationCircleVO decorationCircleVO,List<DecorationCirclePictureVO> decorationCirclePictureVOs,String userId) throws FLException {
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		if(creater == null){
			throw new FLException(190005 , "人员不存在");
		}
		
		DecorationCirclePO decorationCirclePO = new DecorationCirclePO(new UserPO());
		
		BeanUtil.copyPropertie(decorationCircleVO, decorationCirclePO,Arrays.asList("creater"));
		BeanUtil.copyPropertie(creater, decorationCirclePO.getCreater(),Arrays.asList("duty","dept"));
		
		decorationCirclePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationCirclePO.setPraise(DecorationCirclePO.PRAISE_INIT_INTEGER);
		
		decorationCircleDao.save(decorationCirclePO);
		
		if(decorationCirclePictureVOs != null && decorationCirclePictureVOs.size() != 0){
			
			for(DecorationCirclePictureVO decorationCirclePictureVO : decorationCirclePictureVOs){
				
				DecorationCirclePicturePO decorationCirclePicturePO = new DecorationCirclePicturePO();
				
				decorationCirclePicturePO.setDcid(decorationCirclePO.getDcid());
				decorationCirclePicturePO.setPath(decorationCirclePictureVO.getPath());
				
				decorationCirclePictureDao.save(decorationCirclePicturePO);
				
			}
			
		}
		
		return 0;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationCircleForLike(DecorationCircleVO decorationCircleVO) throws FLException {
		
		DecorationCirclePO decorationCirclePO = decorationCircleDao.get(decorationCircleVO.getDcid());
		
		if(decorationCirclePO != null){
			
			int praise = (int) Arith.add(decorationCirclePO.getPraise(), 1);
			decorationCirclePO.setPraise(praise);
			
			decorationCircleDao.update(decorationCirclePO);
		}
		
		return 0;
	}

}
