package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class UserPreferVO implements Serializable {

    private static final long serialVersionUID = 2464060102902589844L;

    private Long upid;

    private String userId;

    private String module;

    private String page;

    private String pkey;

    private String pvalue;

    private Integer company;

    private Timestamp createTime;

    private Timestamp updateTime;

    public Long getUpid() {
        return upid;
    }

    public void setUpid(Long upid) {
        this.upid = upid;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public String getPkey() {
        return pkey;
    }

    public void setPkey(String pkey) {
        this.pkey = pkey;
    }

    public String getPvalue() {
        return pvalue;
    }

    public void setPvalue(String pvalue) {
        this.pvalue = pvalue;
    }

    public Integer getCompany() {
        return company;
    }

    public void setCompany(Integer company) {
        this.company = company;
    }

    @JSON(format = "yyyy-MM-dd HH:mm")
    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    @JSON(format = "yyyy-MM-dd HH:mm")
    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }

}
