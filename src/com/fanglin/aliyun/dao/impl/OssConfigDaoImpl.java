package com.fanglin.aliyun.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.aliyun.dao.OssConfigDao;
import com.fanglin.aliyun.po.OssConfigPO;

@Repository("ossConfigDao")
public class OssConfigDaoImpl extends DaoImpl<OssConfigPO> implements OssConfigDao {

	public OssConfigDaoImpl() {
		super(OssConfigPO.class);
	}

	@Override
	public OssConfigPO querySignature(String accessKeyId, String endpoint, String bucket, String dir) {

		return (OssConfigPO) session().createCriteria(OssConfigPO.class).add(Restrictions.eq("accessKeyId", accessKeyId)).add(Restrictions.eq("endpoint", endpoint)).add(Restrictions.eq("bucket", bucket)).add(Restrictions.eq("dir", dir)).uniqueResult();
	}

}
