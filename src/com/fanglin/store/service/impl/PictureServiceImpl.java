package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.PictureDao;
import com.fanglin.store.po.PicturePO;
import com.fanglin.store.service.PictureService;
import com.fanglin.store.vo.PictureVO;
import com.fanglin.utils.BeanUtil;

@Service("pictureService")
@Transactional(readOnly = true)
public class PictureServiceImpl implements PictureService {
	
	@Autowired
	private PictureDao pictureDao;

	@Override
	public List<PictureVO> queryPictureByGid(PictureVO picture) {
	
		List<PicturePO> picturePOs = pictureDao.queryPictureByGid(picture.getGid());
		
		List<PictureVO> pictureVOs = new ArrayList<PictureVO>();
		
		PictureVO pictureVO;
		for (PicturePO picturePO : picturePOs) {
			
			pictureVO = new PictureVO();
			
			BeanUtil.copyProperties(picturePO, pictureVO);
			
			pictureVOs.add(pictureVO);
			
		}
		
		return pictureVOs;
		
	}
	
	@Override
	public List<PictureVO> queryPicture(PictureVO picture) {
		
		List<PicturePO> picturePOs = pictureDao.queryPicture(picture.getGid(), picture.getType());
		List<PictureVO> pictureVOs = new ArrayList<PictureVO>();
		
		PictureVO pictureVO;
		
		for (PicturePO picturePO : picturePOs) {
			
			pictureVO = new PictureVO();
			
			BeanUtil.copyProperties(picturePO, pictureVO);
			
			pictureVOs.add(pictureVO);
		}
		
		return pictureVOs;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<PictureVO> addPicture(PictureVO picture ,List<String> imgs) {
		
		List<PictureVO> pictureVOs = new ArrayList<PictureVO>();
		List<PicturePO> picturePOs = pictureDao.queryPicture(picture.getGid(), picture.getType());
		
		if(picturePOs.size() == 0){
			picturePOs = new ArrayList<PicturePO>();
		}
		
		for (String img : imgs) {
			
			PicturePO picturePO = new PicturePO();
			
			BeanUtil.copyProperties(picture, picturePO, Arrays.asList("img", "sort"));
			
			if(picturePOs != null && picturePOs.size() > 0){
				
				int length = picturePOs.size();
				
				Short newSort = picturePOs.get(length-1).getSort();
				
				picturePO.setSort((short) (newSort+1));
				
			}else{
				
				picturePO.setSort((short) 1);
				
			}
			
			picturePO.setImg(img);
			
			pictureDao.save(picturePO);
			
			picturePOs.add(picturePO);
			
			PictureVO pictureVO = new PictureVO();
			
			BeanUtil.copyProperties(picturePO, pictureVO);
			
			pictureVOs.add(pictureVO);
			
		}
		
		return pictureVOs;
			
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updatePictureForSort(List<PictureVO> pictures) throws FLException {
		
		List<Long> pids = new ArrayList<Long>();
		List<Short> nums = new ArrayList<Short>();
		
		for (PictureVO pictureVO : pictures) {
			
			PicturePO picturePO = pictureDao.get(pictureVO.getPid());
			
			if(picturePO == null){
				throw new FLException(340008, "图片信息不存在");
			}
			
			pids.add(picturePO.getPid());
			nums.add(picturePO.getSort());
		}
		
		pictureDao.updatePictureForSort(pids.get(0), nums.get(1));
		pictureDao.updatePictureForSort(pids.get(1), nums.get(0));
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deletePicture(PictureVO picture) {
		
		PicturePO picturePO = pictureDao.get(picture.getPid());
		
		pictureDao.delete(picturePO);
	}

}
