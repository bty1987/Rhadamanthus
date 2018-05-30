package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.PicturePO;

public interface PictureDao extends Dao<PicturePO> {

	public List<PicturePO> queryPicture(Long gid, Short type, Short status);

	public void updatePictureForSort(Long pid, Short sort);

}
